from enum import Enum

class SimpleQueries(Enum):
    DROP_DATABASE = 'DROP DATABASE IF EXISTS nutribite;'
    
    CREATE_DATABASE_IF_NOT_EXISTS = "CREATE DATABASE IF NOT EXISTS nutribite;"
    
    CREATE_DIETARY_PREFERENCE_TABLE = '''
        CREATE TABLE IF NOT EXISTS dietary_preference (
            Name VARCHAR(255) PRIMARY KEY
        );
    '''
    
    CREATE_USER_AUTHENTICATION_TABLE = '''
        CREATE TABLE IF NOT EXISTS user (
            Id INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(255) NOT NULL,
            Password VARCHAR(255) NOT NULL,
            Email VARCHAR(255) UNIQUE NOT NULL,
            Spiciness FLOAT CHECK (Spiciness >= 0 AND Spiciness <= 10) DEFAULT 5,
            Sweetness FLOAT CHECK (Sweetness >= 0 AND Sweetness <= 10) DEFAULT 5,
            Salt VARCHAR(6) CHECK (Salt IN ('Less', 'Medium', 'High')) DEFAULT 'Medium',
            DietaryPreference VARCHAR(20),            
            
            FOREIGN KEY (DietaryPreference)
            REFERENCES dietary_preference (Name)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        );
    '''
    
    
    CREATE_MENU_CATEGORIES_TABLE = '''
        CREATE TABLE IF NOT EXISTS menu_category (
            Name VARCHAR(255) PRIMARY KEY
        );
    '''
    
    DROP_MENU_CATEGORIES_TABLE = '''
        DROP TABLE menu_category;
    '''
    
    DROP_MENU_ITEMS_TABLE = '''
        DROP TABLE menu_item;
    '''
    
    CREATE_MENU_ITEMS_TABLE = '''
        CREATE TABLE IF NOT EXISTS menu_item (
            Id INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(255) UNIQUE NOT NULL,
            Description VARCHAR(255) NOT NULL,
            Cost DECIMAL(4, 2) CHECK (cost > 0) NOT NULL,
            CalorieCount FLOAT NOT NULL,
            ProteinCount FLOAT NOT NULL,
            ImageUrl VARCHAR(255) NOT NULL,
            Category VARCHAR(255) NOT NULL DEFAULT 'NutriBite Special',
            
            FOREIGN KEY (Category)
            REFERENCES menu_category (Name)
            ON DELETE SET DEFAULT
            ON UPDATE CASCADE
        );
    '''
    
    CREATE_USER_CART_TABLE = '''
        CREATE TABLE IF NOT EXISTS cart (
            UserId INT NOT NULL,
            MenuItemId INT NOT NULL,
            Quantity INT CHECK (quantity >= 0),
            ExtraNote VARCHAR(255),
            PRIMARY KEY (UserId, MenuItemId),
            
            FOREIGN KEY (UserId)
            REFERENCES user(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
            
            FOREIGN KEY (MenuItemId)
            REFERENCES menu_item(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        );
    '''
    
    CREATE_USER_MENU_SETTINGS = '''
        CREATE TABLE IF NOT EXISTS user_settings (
            UserId INT NOT NULL,
            MenuItemId INT NOT NULL,
            Spiciness FLOAT CHECK (Spiciness >= 0 AND Spiciness <= 10),
            Sweetness FLOAT CHECK (Sweetness >= 0 AND Sweetness <= 10),
            Salt VARCHAR(6) CHECK (Salt IN ('Less', 'Medium', 'High')),
            PRIMARY KEY (UserId, MenuItemId),
            
            FOREIGN KEY (UserId)
            REFERENCES user (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,
            
            FOREIGN KEY (MenuItemId)
            REFERENCES menu_item (id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        );
    '''
    
    INSERT_MOCK_USER = '''
        INSERT INTO user (Name, Password, Email)
        VALUES ("test", "test", "test@test.com")
    '''
    
    INSERT_DIETARY_PREFERENCES = '''
        INSERT INTO dietary_preference 
        VALUES ("Vegan"), 
        ("Vegetarian"), 
        ("Swami Narayan"), 
        ("Jain"), 
        ("Non vegetarian"), 
        ("Gluten Free"),
        ("Kosher"), 
        ("Halal");
    '''
    
    INSERT_MENU_CATEGORIES = '''
        INSERT INTO menu_category 
        VALUES ("Breakfast"),
        ("Curry"),
        ("Starters"),
        ("Breads"),
        ("Rice"),
        ("Soups"),
        ("Ice-cream"),
        ("Snacks"),
        ("Tea"),
        ("Coffee"),
        ("Milkshake");
    '''
    
    INSERT_MENU_ITEMS = '''
        INSERT INTO menu_item
        (Name, Description, Cost, CalorieCount, ProteinCount, ImageUrl, Category)
        VALUES
        ('Paneer Tikka Masala',   'Smoky paneer tikka in spiced tomato gravy', 15.00, 475, 18.0, 'paneer%20tikka%20masala.png?updatedAt=1760828002471', 'Curry'),
        ('Paneer Chilly Dry',     'Crispy Indo-Chinese chili paneer (dry)',    14.25, 637, 32.5, 'paneer%20chilly%20dry.png?updatedAt=1760828001182', 'Starters'),
        ('Paneer Kadhai',         'Paneer with peppers & onions in kadai masala',14.25, 637, 32.5,'paneer%20kadhai.png?updatedAt=1760828002445', 'Curry'),
        ('Paneer Kofta',          'Paneer dumplings in creamy gravy',          14.25, 637, 32.5, 'paneer%20kofta.png?updatedAt=1760828002137', 'Curry'),
        ('Palak Paneer',          'Spinach puree with soft paneer',            14.25, 637, 32.5, 'palak%20paneer.png?updatedAt=1760828002197', 'Curry'),
        ('Jeera Rice',            'Basmati rice tempered with cumin',           7.00, 247,  5.3, 'jeera%20rice.png?updatedAt=1760828002055', 'Rice'),
        ('Veg Kofta',             'Vegetable dumplings in rich gravy',         14.25, 392, 13.4, 'veg%20kofta.png?updatedAt=1760828002040', 'Curry'),
        ('Paneer Chilly Masala',  'Chili paneer (gravy) with peppers',         14.25, 366, 15.0, 'paneer%20chilly%20masala.png?updatedAt=1760828001439', 'Curry'),
        ('Paneer Butter Masala',  'Creamy tomato-butter sauce with paneer',    16.70, 294, 15.1, 'paneer%20butter%20masala.png?updatedAt=1760828001421', 'Curry'),
        ('Plain Rice',            'Steamed basmati rice',                       3.50, 205,  4.3, 'plain%20rice.png?updatedAt=1760828000563', 'Rice');
    '''
    