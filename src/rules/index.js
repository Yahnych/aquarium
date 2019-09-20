const rules = {
    // Genome initial values
    INITIAL_MIN_CONSTANT: 0,
    INITIAL_MAX_CONSTANT: 1,
    INITIAL_MAX_SPEED: 1,
    INITIAL_SIZE: 25,
    INITIAL_SMELL_DISTANCE: 50,
    INITIAL_SOUND_DISTANCE: 50,
    INITIAL_R_COLOR: 255,
    INITIAL_G_COLOR: 255,
    INITIAL_B_COLOR: 255,
    INITIAL_MIN_HEALTH: 70,
    INITIAL_BRAIN_ACTIVITY_FREQUENCY: 10,
    INITIAL_MAX_CHRONO: 1000,
    INITIAL_MAX_LIFETIME: 2000,


    // Genome mutations rules
    CONSTANT_VARIATION_PERCENTAGE: 0,
    MAX_SPEED_VARIATION_PERCENTAGE: 20,
    SIZE_VARIATION_PERCENTAGE: 20,
    SMELL_DISTANCE_VARIATION_PERCENTAGE: 1,
    SOUND_DISTANCE_VARIATION_PERCENTAGE: 1,
    COLOR_VARIATION_PERCENTAGE: 1,
    INITIAL_MIN_HEALTH_VARIATION_PERCENTAGE: 1,
    BRAIN_ACTIVITY_FREQUENCY_VARIATION_PERCENTAGE: 1,
    MAX_CHRONO_VARIATION_PERCENTAGE: 1,
    MAX_LIFETIME_VARIATION_PERCENTAGE: 1,

    // Brain initial values
    INPUT_NUMBER: 9,
    OUTPUT_NUMBER: 6,

    // Default world rules
    TOTAL_ENERGY_AMOUNT: 10000,
    FOOD_MIN_ENERGY: 100,
    FOOD_MAX_ENERGY: 100,
    POPULATION_SIZE: 10,
    EGG_HATCHING_TIME: 300,
    EGG_LAYING_HEALTH_PRICE_PERCENTAGE: 80,
    //assuming 60 fps => -1/sec
    HUNDER_PENALITY: 1/60

};
