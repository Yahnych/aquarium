class Entity {
    constructor(parent, x, y) {
        this.genome = new Genome(parent);
        this.brain = Brain(parent);

        // State
        this.x = x || random(0, windowWidth);
        this.y = y || random(0, windowHeight);
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.health = this.genome.minHealth;
        this.chrono = 0;
        this.lifeTime = 0;
        this.brainActivityClock = 0;
        this.waste = 0;
        this.closeFood = [];

        this.output = {
            angle: 0,
            velocityFactor: 0,
            wantToEat: false,
            wantToLay: false,
            resetChrono: false
        };

        this.lifeTimeInSeconds = 0;
        this.children = 0;
        this.generation = parent ? parent.generation + 1 : 1;

    }

    update() {
        if (this.health <= 0) {
            world.kill(world.population.indexOf(this));
            let foodToSpawn = (this.waste + this.health) / 20;
            console.log('Adding: ', Math.round(foodToSpawn), 'to', world.food.length)
            for (let i = 0; i < Math.round(foodToSpawn); i++) {
                const position = randPositionInCircle(this.x, this.y, this.genome.size * 2);
                world.food.push(new Food(position.x, position.y))
            }
            return;
        }

        const input = this.getInput();
        //console.log(input)
        const output = this.brain.activate(input);
        this.setOutput(output);

        if (this.output.resetChrono) {
            this.chrono = 0;
        }

        // Calculate the new direction
        this.xAcceleration = Math.cos(this.output.angle) * this.output.velocityFactor;
        this.yAcceleration = Math.sin(this.output.angle) * this.output.velocityFactor

        // Calculate and limit the speed
        this.xVelocity += this.xAcceleration;
        this.yVelocity += this.yAcceleration;
        this.xVelocity = this.xVelocity > this.genome.maxSpeed ?
            this.genome.maxSpeed : this.xVelocity < -this.genome.maxSpeed ?
                -this.genome.maxSpeed : this.xVelocity;
        this.yVelocity = this.yVelocity > this.genome.maxSpeed ?
            this.genome.maxSpeed : this.yVelocity < -this.genome.maxSpeed ?
                -this.genome.maxSpeed : this.yVelocity;

        // Calculate new position
        this.x += this.xVelocity;
        this.y += this.yVelocity;

        // Limit position to width and height
        //this.x = this.x >= windowWidth  ? windowWidth  : this.x <= 0 ? 0 : this.x;
        //this.y = this.y >= windowHeight ? windowHeight : this.y <= 0 ? 0 : this.y;

        // Calculate rebound
        /*if(this.x === 0 || this.x === windowWidth) {
            this.xVelocity = -this.xVelocity;
        }
        if(this.y === 0 || this.y === windowHeight) {
            this.yVelocity = -this.yVelocity;
        }*/
        //console.log(Math.floor(this.x), Math.floor(this.y))
        if (this.x > windowWidth) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = windowWidth;
        }

        if (this.y > windowHeight) {
            this.y = 0;
        } else if (this.y < 0) {
            this.y = windowHeight;
        }


        this.lifeTime += 1;
        this.brainActivityClock += 1;
        const price = this.genome.minHealth //* (rules.EGG_LAYING_HEALTH_PRICE_PERCENTAGE / 100);
        this.eat();
        if (this.output.wantToLay && this.health >= price && this.lifeTime >= this.genome.maxLifeTime * 0.2) {
            this.layEgg(price);

        }

        const consumption = 1/120 + (1/240 * (Math.pow(vectorMagnitude(this.xVelocity, this.yVelocity), 2) * (1/2*this.genome.size)));
        //console.log(consumption)
        this.health -= consumption;
        this.waste += consumption;
        this.draw();
    }

    getInput() {
        const brainActivation = this.brainActivityClock === this.genome.brainActivityFrequency;
        if (brainActivation) {
            this.brainActivityClock = 0;
        }

        this.detectCloseFood();
        this.detectClosestFood();
        const angle = this.calculateAngleToClosestFood();
        const distance = this.calculateDistanceToClosestFood();
        const speed = vectorMagnitude(this.xVelocity, this.yVelocity) || 0;
        //get the inputs !
        return [
            this.genome.constant,
            +brainActivation,
            this.chrono / this.genome.maxChrono,
            this.health,
            this.lifeTime,
            this.children,
            speed,
            this.closeFood.length,
            angle,
            distance
        ];
    }

    setOutput(output) {
        this.output.angle = (output[0]) * 2 * Math.PI;
        this.output.velocityFactor = output[1] * this.genome.maxSpeed;
        this.output.wantToEat = output[2] < 0.5;
        this.output.wantToLay = output[3] > 0.5;
        this.output.resetChrono = output[4] > 0.5;

    }

    detectCloseFood() {
        this.closeFood = world.food.map(food => ({
            food: food,
            distance: calculateDistance(this, food)
        })).filter(foodDescriptor => foodDescriptor.distance <= this.genome.smellDistance);
    }

    detectClosestFood() {
        this.closestFood = this.closeFood.length ?
            this.closeFood.reduce((min, foodDescriptor) =>
                foodDescriptor.distance < min ? foodDescriptor.food : min, this.closeFood[0].food)
            : null;
        //console.log(this.closestFood)
    }

    calculateAngleToClosestFood() {
        //if (this.closestFood)
        //console.log( angleToPoint(this.x, this.y, this.closestFood.x, this.closestFood.y))
        return this.closestFood ? angleToPoint(this.x, this.y, this.closestFood.x, this.closestFood.y) / (2 * Math.PI) : 1;
    }

    calculateDistanceToClosestFood() {
        //console.log(this.x, this.y, "bitch")
        return this.closestFood ? calculateDistance(this, this.closestFood) / this.genome.smellDistance : 1;
    }

    eat() {
         this.closeFood.forEach(({ food }) => {
            const hit = collideCircleCircle(food.x, food.y, food.radius, this.x, this.y, this.genome.size);
            if (hit) {
                //console.log("EATING !", food)
                this.health += food.amount;
                //this.waste += food.amount;
                //world.food.indexOf(world.food.find(f => this.closestFood.x === f.x && this.closestFood.y === f.y))
                world.food.splice(world.food.indexOf(food), 1);
                //world.food.push(new Food())
            }
        })

    }

    layEgg(price) {
        //console.log("eggley", price, this.health)
        world.eggs.push(new Egg(this, price));
        this.health -= price;
        //this.waste += price;
        //console.log("eggley", price, this.health)
        this.children += 1;
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Draw the body
        stroke(200, 255);
        strokeWeight(2);
        fill(this.genome.color);
        ellipse(0, 0, this.genome.size, this.genome.size);

        // Draw the head line
        const velocityVector = createVector(this.xVelocity, this.yVelocity);
        rotate(velocityVector.heading());
        line(0,0,25,0);

        pop();
    }

    drawUI() {
        push();
        translate(this.x, this.y);

        // Draw the smell area
        stroke(200, 255);
        strokeWeight(0.5);
        fill(127, 0);
        ellipse(0, 0, this.genome.smellDistance * 2, this.genome.smellDistance * 2);

        pop();

        push();
        translate(0, 0);

        //console.log(this.lifeTime >= this.genome.maxLifeTime * 0.1, this.output.wantToLay, this.health, this.genome.minHealth)
        //this.detectedFood.forEach(df =>line(this.x,this.y, df.x,df.y));
        pop()

        $('#health').text('Health : ' + this.health);
        $('#waste').text('Waste : ' + this.waste);
        $('#generation').text('Generation : ' + this.generation);
        const duration = moment.duration(this.lifeTimeInSeconds, 'seconds');
        const formatted = duration.format("hh:mm:ss");
        $('#lifeTime').text('LifeTime : ' + formatted);
        $('#children').text('Children : ' + this.children);

    }
}
