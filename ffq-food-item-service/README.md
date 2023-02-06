# FFQFoodEntryService

This service will serve as a backing store for the food items that will populate the Food Frequency Questionnaire. 

>Running The Application
- Ensure that a local instance of mongoDb is running on port 27017
- Build and start the application by running FFQFoodEntryApplication.java
    To run from command line: ``mvn spring-boot:run``
- The base endpoint of the API is: **localhost:9090/ffq**

>Load database on startup
- Start the application with the following args: 
- -Dmongo.fooditems.load="true"
- ie) ``mvn spring-boot:run -Dspring-boot.run.arguments="--mongo.fooditems.load=true"``

>Database Information
- Database name: **ffq_database**
- FoodItem Collection name: **food_items**
- NutrientList Collection name: **nutrient_lists**

>FoodItem API

GET calls
- Get all food items: **/fooditems**
__- Get individual item by name: **/{name}**    (Currently case sensitive)
- Get item by its nutrientListID: **/getByID/{nutrientListID}** 

POST calls
- Create a single food item: **/create**
    In the request body, pass one FoodItem object in a JSON payload. 
    Example payload:
    {"name":"Milk with chocolate/strawberry or vanilla (include frozen beverages, shakes, hot chocolate, etc.)", "servingsList":[{"servingName":"4 OZ or less"},{"servingName":"6 OZ"}, {"servingName":"8 OZ"}, {"servingName":"10 OZ"}, {"servingName": "12 OZ or more"}], "foodTypes":[{"nutrientListID":"milkchoc"}], "sugar":{"additionalSugar":true}}
- Create multiple items: **/createMany**
    In the request body, pass an arraylist of FoodItem objects.
    Example payload:
    [{"name":"Breast milk", "foodTypes":[{"nutrientListID":"brea"}],"primary":true},
    {"name":"Formula", "foodTypes":[{"nutrientListID":"form"}],"primary":true},
    {"name":"Water", "foodTypes":[{"nutrientListID":"wate"}], "primary":true}]

DELETE calls
- Delete item by name: **/delete/{name}**
    Pass the name in a request parameter


>NutrientList API

GET calls
- Get all nutrient lists: **/nutrients/nutrientlists**
- Get individual nutrient list by ID: **/nutrients/{nutrientListID}**    (Currently case sensitive)

POST calls
- Create a single item: **/create**
    In the request body, pass one NutrientList object in a JSON payload:
    {"nutrientListID":"wate", "nutrientMap":{"Total Grams":7.6, "Fat (g)":2.4}}
- Create multiple items: **/createMany**
    In the request body, pass multiple NutrientList objects in a JSON payload:
    [{"nutrientListID":"wate", "nutrientMap":{"Total Grams":7.6, "Fat (g)":2.4}},
    {"nutrientListID":"brea", "nutrientMap":{"Total Grams":2, "Fat (g)":1.4}}]
- Calculate nutrient values: **/calculate**
    In the request body, pass an arraylist of FoodItemInput objects.
    Example payload:
    [{"name":"Breast Milk", "frequency":5, "frequencyType":"day", "nutrientListID":"brea", "sugar":0}, 
    {"name":"Milk with chocolate/strawberry or vanilla (include frozen beverages, shakes, hot chocolate, etc.)", "frequency":2, "frequencyType":"day", "nutrientListID":"milkchoc", "serving":"4 OZ or less", "sugar":5}, 
    {"name":"Bread refined", "frequency":3, "frequencyType":"WEEK", "nutrientListID":"brearef", "serving":"0.75 piece", "sugar":0}]

>FoodDescription API

GET calls
- Get all Food Descriptions: **/fooddescription/all**
- Get Food Descriptions for a food item group: **/fooddescription/{foodItemGroup}**

POST calls
- Create a Food Description item: **/fooddescription/create/**
    The request body includes all of the fields found in a Food Description item. Ex:
    {
        "foodItemGroupName": "Breastmilk - Formula - Cow's Milk - Other",
        "firstBracketIntake": "16 - 24 fl oz / day",
        "secondBracketIntake": "10 - 28 fl oz / day",
        "thirdBracketIntake": "8 - 18 fl oz / day",
        "description": "Breastmilk or iron-fortified infant formula is recommended until age 12 months. Do not use low-iron milk, such as cow or soy, even in infant cereal. Do not serve 1% (low-fat) or skim (non-fat) milks before age 24 months.",
        "imageUrl": "/assets/images/Breastmilk.jpg"
    }

PUT calls
- Update a Food Description item: **/fooddescription/update/{id}**
    URL parameter 'id' is the item id as hexadecimal. Ex: 5ef3aff74f9ed93eafcd3f50
    The request body can include any or all of the fields found in a Food Description item. Ex:
    {
        "foodItemGroupName": "Breastmilk - Formula - Cow's Milk - Other",
        "firstBracketIntake": "16 - 24 fl oz / day",
        "secondBracketIntake": "10 - 28 fl oz / day",
        "thirdBracketIntake": "8 - 18 fl oz / day",
        "description": "Breastmilk or iron-fortified infant formula is recommended until age 12 months. Do not use low-iron milk, such as cow or soy, even in infant cereal. Do not serve 1% (low-fat) or skim (non-fat) milks before age 24 months.",
        "imageUrl": "/assets/images/Breastmilk.jpg"
    }

>Loading nutrient values from excel file to nutrient list collection in mongo
1) The NutrientDatabase.xlsx file is in the root folder. Make sure the data in all columns is correct,
and that there are no extra rows that don't contain any data. Make sure none of the cells are using a 
formula, that is, getting their values from an external source.

    Note: To prevent parse errors, I copied and pasted all the data in the excel sheet, and pasted it with
    the value only option. Make sure to do this anytime the database changes.

    Lastly, make sure all the rows have a unique typeID. Duplicate typeIDs will be highlited in red.




