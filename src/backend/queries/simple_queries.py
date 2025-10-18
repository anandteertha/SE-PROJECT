from enum import Enum

class SimpleQueries(Enum):
    CREATE_DATABASE_IF_NOT_EXISTS = "CREATE DATABASE IF NOT EXISTS nutribite;"
    
    CREATE_USER_AUTHENTICATION_TABLE = '''
        CREATE TABLE IF NOT EXISTS user (
            Id INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(255) NOT NULL,
            Password VARCHAR(255) NOT NULL,
            Email VARCHAR(255) UNIQUE NOT NULL,
            Spiciness FLOAT CHECK (Spiciness >= 0 AND Spiciness <= 10) DEFAULT 5,
            Sweetness FLOAT CHECK (Sweetness >= 0 AND Sweetness <= 10) DEFAULT 5,
            Salt VARCHAR(6) CHECK (Salt IN ('Less', 'Medium', 'High')) DEFAULT 'Medium',
            DietaryPreference VARCHAR(20) 
            CHECK (DietaryPreference IN ('Vegan', 'Vegetarian', 'Swami Narayan', 'Jain', 'Non vegetarian')) 
            DEFAULT 'Vegetarian'
        );
    '''
    
    CREATE_MENU_ITEMS_TABLE = '''
        CREATE TABLE IF NOT EXISTS menu_item (
            Id INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(255) UNIQUE NOT NULL,
            Cost DECIMAL(4, 2) CHECK (cost > 0) NOT NULL,
            CalorieCount FLOAT NOT NULL,
            ProteinCount FLOAT NOT NULL,
            ImageUrl VARCHAR(255) NOT NULL,
            Category VARCHAR(255) NOT NULL
            
            FOREIGN KEY (Category)
            REFERENCES menu_category (Name)
            ON DELETE DEFAULT 'NutriBite Special'
            ON UPDATE CASCADE
        );
    '''
    
    CREATE_MENU_CATEGORIES_TABLE = '''
        CREATE TABLE IF NOT EXISTS menu_category (
            Name VARCHAR(255) PRIMARY KEY
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
    