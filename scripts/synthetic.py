#!/usr/bin/env python3

"""This script creates synthetic data for a restaurant's database.

Script generated with ChatGPT 4o
"""

import random
import datetime
import argparse
import csv
import bcrypt
from faker import Faker

# Initialize Faker
fake = Faker()

# Set random seed for reproducibility
random.seed(42)
fake.seed_instance(42)

# Default configuration
DEFAULT_CONFIG = {
    "num_categories": 10,
    "num_menu_items": 50,
    "num_users": 100,
    "num_reviews": 200,
    "output_format": "sql",  # Options: 'sql', 'csv', 'json'
    "output_dir": "output"
}


def generate_timestamp(start_date=datetime.datetime(2022, 1, 1),
                       end_date=datetime.datetime(2025, 4, 15)):
    """Generate a random timestamp between start_date and end_date"""
    delta = end_date - start_date
    random_second = random.randint(0, int(delta.total_seconds()))
    return start_date + datetime.timedelta(seconds=random_second)


def generate_password_hash(password):
    """Generate a bcrypt password hash"""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt)


def generate_restaurant_description(category_name):
    """Generate a relevant description for a restaurant category"""
    descriptions = {
        "Appetizers": [
            "Start your meal with our delicious small plates perfect for sharing.",
            "Tantalizing starters to awaken your taste buds before the main course.",
            "House specialties to begin your culinary journey with us."
        ],
        "Salads": [
            "Fresh, crisp greens and vegetables with house-made dressings.",
            "Healthy and refreshing options featuring seasonal produce.",
            "Light and nutritious combinations perfect for any meal."
        ],
        "Soups": [
            "Hearty, comforting broths and creamy blends made fresh daily.",
            "Warming, flavorful recipes passed down through generations.",
            "Seasonal selections prepared with locally-sourced ingredients."
        ],
        "Sandwiches": [
            "Handcrafted with artisanal breads and premium fillings.",
            "Perfect handheld meals for lunch or a light dinner option.",
            "Creative combinations that elevate the humble sandwich."
        ],
        "Burgers": [
            "Premium beef patties cooked to perfection with gourmet toppings.",
            "Signature creations featuring our house-ground blend of select cuts.",
            "A favorite among our regulars, with vegetarian options available."
        ],
        "Pasta": [
            "Authentic Italian recipes with house-made noodles and sauces.",
            "Classic comfort food elevated with premium ingredients.",
            "Al dente perfection topped with carefully crafted sauces."
        ],
        "Pizza": [
            "Stone-fired with artisanal dough and premium toppings.",
            "Traditional and creative options featuring our signature sauce.",
            "Handcrafted pies perfect for sharing or enjoying solo."
        ],
        "Seafood": [
            "Fresh catches delivered daily, prepared with seasonal accompaniments.",
            "Sustainable selections from trusted fishermen and suppliers.",
            "Ocean treasures transformed into delectable culinary experiences."
        ],
        "Steaks": [
            "Premium cuts aged to perfection and grilled to your preference.",
            "Select beef from trusted ranchers, seasoned and cooked to order.",
            "The centerpiece of our menu, accompanied by chef-selected sides."
        ],
        "Vegetarian": [
            "Creative plant-based dishes that satisfy even dedicated carnivores.",
            "Seasonal vegetables transformed into satisfying main courses.",
            "Thoughtfully prepared meat-free options full of flavor."
        ],
        "Vegan": [
            "Innovative plant-based creations without animal products.",
            "Wholesome and satisfying dishes celebrating vegetables and legumes.",
            "Ethical eating without compromising on taste or presentation."
        ],
        "Gluten-Free": [
            "Carefully prepared options safe for those with gluten sensitivities.",
            "Delicious alternatives to wheat-based classics.",
            "Certified gluten-free ingredients prepared in a dedicated space."
        ],
        "Breakfast": [
            "Morning classics and innovative dishes to start your day right.",
            "House specialties featuring farm-fresh eggs and local produce.",
            "Sweet and savory options served with our signature coffee blend."
        ],
        "Lunch Specials": [
            "Midday offerings perfect for a quick but satisfying meal.",
            "Rotating selection of chef's favorites at a special price.",
            "Express options for busy professionals without compromising quality."
        ],
        "Dinner Entrees": [
            "Evening selections showcasing our chef's finest creations.",
            "Signature dishes perfect for a memorable dining experience.",
            "Seasonal specialties featuring the freshest local ingredients."
        ],
        "Desserts": [
            "Sweet finales to complete your dining experience.",
            "House-made treats crafted by our pastry chef.",
            "Indulgent creations featuring premium chocolate and seasonal fruits."
        ],
        "Beverages": [
            "Refreshing selections to complement your meal.",
            "House-made sodas, fresh-squeezed juices, and specialty drinks.",
            "Non-alcoholic options crafted with the same care as our food."
        ],
        "Cocktails": [
            "Handcrafted libations featuring premium spirits and fresh ingredients.",
            "Creative concoctions from our master mixologists.",
            "Classic and innovative drinks to enhance your dining experience."
        ],
        "Wine": [
            "Curated selection of fine wines from around the world.",
            "Carefully chosen vintages to complement our menu.",
            "Options available by the glass or bottle to suit any preference."
        ],
        "Beer": [
            "Local craft brews and international favorites on tap and bottled.",
            "Rotating selection of seasonal and limited-edition offerings.",
            "Perfect pairings for our hearty menu items."
        ],
        "Kids Menu": [
            "Child-sized portions of favorites for our younger guests.",
            "Nutritious options that kids will actually enjoy eating.",
            "Fun presentations that make mealtime an adventure."
        ],
        "Seasonal Specials": [
            "Limited-time offerings featuring the best of the season.",
            "Chef's creations inspired by local harvests and traditions.",
            "Unique dishes that showcase exceptional seasonal ingredients."
        ],
        "Chef's Recommendations": [
            "Personal favorites selected by our executive chef.",
            "Signature dishes that represent our culinary philosophy.",
            "Must-try items that have become customer favorites."
        ],
        "Local Favorites": [
            "Beloved dishes that keep our regulars coming back.",
            "Regional specialties with our unique interpretation.",
            "Community favorites that have stood the test of time."
        ]
    }

    # Default description if category isn't in our predefined list
    default_descriptions = [
        "Carefully selected options to satisfy every palate.",
        "House specialties created with premium ingredients.",
        "Customer favorites prepared with attention to detail."
    ]

    return random.choice(descriptions.get(category_name, default_descriptions))


def generate_menu_item_description(item_name):
    """Generate a realistic description for a menu item"""

    # Different description templates based on food type
    appetizer_desc = [
        "A perfect starter to share, featuring {quality} ingredients.",
        "This {adj} appetizer pairs wonderfully with our craft cocktails.",
        "A house favorite that's {adj} and perfect for sharing."
    ]

    salad_desc = [
        "Crisp, {adj} greens tossed with {quality} dressing and seasonal garnishes.",
        "A refreshing blend of {adj} vegetables and house-made vinaigrette.",
        "Farm-fresh ingredients combined to create a {adj} starter or light meal."
    ]

    soup_desc = [
        "A {adj} broth simmered slowly to develop deep, complex flavors.",
        "This comforting classic is made fresh daily with {quality} ingredients.",
        "Our chef's special recipe, featuring {adj} seasonal ingredients."
    ]

    sandwich_desc = [
        "Served on {adj} artisanal bread with premium fillings and accompaniments.",
        "A satisfying handheld meal featuring {quality} ingredients.",
        "Our unique take on a classic, made with {adj} components."
    ]

    burger_desc = [
        "A juicy patty cooked to perfection, topped with {adj} accompaniments.",
        "Our signature blend grilled to your preference with {quality} toppings.",
        "A customer favorite featuring {adj} flavors in every bite."
    ]

    pasta_desc = [
        "Al dente pasta tossed with our {adj} house-made sauce.",
        "A {quality} combination of textures and flavors in this Italian classic.",
        "Our chef's special recipe featuring {adj} seasonal ingredients."
    ]

    pizza_desc = [
        "Stone-fired crust topped with {adj} ingredients and our signature sauce.",
        "A perfect balance of {quality} toppings on our hand-stretched dough.",
        "This {adj} pie is a house specialty that keeps customers coming back."
    ]

    seafood_desc = [
        "Fresh catch prepared with {adj} seasonal accompaniments.",
        "Sustainably sourced seafood showcased with {quality} ingredients.",
        "A {adj} preparation that highlights the natural flavors of the sea."
    ]

    steak_desc = [
        "Premium cut aged to perfection and grilled to your preference.",
        "Tender beef seasoned simply to enhance its {adj} natural flavor.",
        "A {quality} steak experience paired with chef-selected sides."
    ]

    dessert_desc = [
        "A sweet finale featuring {adj} flavors and textures.",
        "Our pastry chef's {quality} creation to satisfy your sweet tooth.",
        "An indulgent treat made with {adj} chocolate and seasonal fruits."
    ]

    default_desc = [
        "A house specialty prepared with {quality} ingredients.",
        "This {adj} dish is a customer favorite.",
        "Carefully crafted flavors make this a {adj} choice."
    ]

    # Map food types to description templates
    description_map = {
        "Bruschetta": appetizer_desc, "Mozzarella Sticks": appetizer_desc,
        "Calamari": appetizer_desc, "Spinach Dip": appetizer_desc,
        "Buffalo Wings": appetizer_desc,

        "Caesar Salad": salad_desc, "Greek Salad": salad_desc,
        "Cobb Salad": salad_desc, "Caprese Salad": salad_desc,
        "Garden Salad": salad_desc,

        "Tomato Bisque": soup_desc, "Clam Chowder": soup_desc,
        "French Onion": soup_desc, "Chicken Noodle": soup_desc,
        "Vegetable Soup": soup_desc,

        "Club Sandwich": sandwich_desc, "BLT": sandwich_desc,
        "Reuben": sandwich_desc, "Grilled Cheese": sandwich_desc,
        "Chicken Wrap": sandwich_desc,

        "Classic Burger": burger_desc, "Cheeseburger": burger_desc,
        "Veggie Burger": burger_desc, "Bacon Burger": burger_desc,
        "Mushroom Burger": burger_desc,

        "Spaghetti": pasta_desc, "Fettuccine Alfredo": pasta_desc,
        "Lasagna": pasta_desc, "Ravioli": pasta_desc,
        "Penne Vodka": pasta_desc,

        "Margherita": pizza_desc, "Pepperoni": pizza_desc,
        "Vegetable": pizza_desc, "Supreme": pizza_desc,
        "Hawaiian": pizza_desc,

        "Grilled Salmon": seafood_desc, "Shrimp Scampi": seafood_desc,
        "Fish & Chips": seafood_desc, "Lobster Tail": seafood_desc,
        "Crab Cakes": seafood_desc,

        "Chocolate Cake": dessert_desc, "Cheesecake": dessert_desc,
        "Apple Pie": dessert_desc, "Ice Cream": dessert_desc,
        "Tiramisu": dessert_desc
    }

    # Adjectives and quality descriptors to fill in the templates
    adjectives = ["flavorful", "delicious", "savory", "aromatic", "zesty",
                  "fresh", "hearty", "tender", "crispy", "creamy",
                  "rich", "light", "bold", "spicy", "subtle",
                  "mouthwatering", "succulent", "tangy", "smoky", "sweet"]

    quality_desc = ["premium", "hand-selected", "locally-sourced", "organic",
                    "artisanal", "house-made", "farm-fresh", "seasonal",
                    "carefully chosen", "exceptional", "high-quality",
                    "gourmet", "traditional", "authentic", "signature"]

    # Select the appropriate description template and fill it in
    desc_template = random.choice(description_map.get(item_name, default_desc))
    description = desc_template.format(
        adj=random.choice(adjectives),
        quality=random.choice(quality_desc)
    )

    return description


def generate_review_content(stars):
    """Generate a realistic review content based on star rating"""

    positive_templates = [
        "Absolutely loved the {food_aspect}! The {service_aspect} was also exceptional.",
        "One of the best meals I've had in a while. {highlight} was outstanding.",
        "Can't say enough good things about this place. {highlight} exceeded expectations.",
        "A hidden gem with amazing {food_aspect}. Will definitely return for the {highlight}.",
        "Fantastic experience from start to finish. {service_aspect} made our night special.",
        "Excellent quality and presentation. The {food_aspect} was perfect.",
        "Great atmosphere and even better food. The {highlight} is a must-try!",
        "Consistently delicious every time we visit. {food_aspect} never disappoints.",
        "Top-notch {food_aspect} and {service_aspect}. Highly recommend!",
        "A wonderful dining experience. {highlight} was the highlight of our evening."
    ]

    neutral_templates = [
        "Decent {food_aspect}, though the {service_aspect} could be improved.",
        "Good food but nothing extraordinary. {highlight} was the best part.",
        "Satisfactory experience overall. {food_aspect} was good but not great.",
        "Average {food_aspect} for the price point. {service_aspect} was acceptable.",
        "Not bad, but not memorable either. {highlight} was better than expected.",
        "Solid choice for casual dining. {food_aspect} was reliable.",
        "Reasonable quality but lacks consistency. {service_aspect} varies by visit.",
        "Middle-of-the-road experience. {highlight} was good, rest was average.",
        "Fair value for what you get. {food_aspect} could use more seasoning.",
        "Adequate service and food quality. {highlight} was the standout item."
    ]

    negative_templates = [
        "Disappointed with the {food_aspect}. {service_aspect} needs serious improvement.",
        "Would not recommend. {highlight} was particularly underwhelming.",
        "Not worth the price. {food_aspect} was bland and uninspired.",
        "Poor experience overall. {service_aspect} was the biggest issue.",
        "Expected much better based on reviews. {highlight} was a letdown.",
        "Sadly, the quality has declined. {food_aspect} was not as good as before.",
        "Regrettably mediocre food and service. {highlight} was the only decent part.",
        "Would not return. {food_aspect} was not prepared well.",
        "Subpar experience from start to finish. {service_aspect} was disappointing.",
        "Not impressed at all. {highlight} and everything else fell short of expectations."
    ]

    food_aspects = [
        "flavors", "presentation", "portion sizes", "menu selection",
        "ingredient quality", "food preparation", "taste", "culinary creativity",
        "freshness", "dish composition", "temperature of the food", "seasoning"
    ]

    service_aspects = [
        "service", "staff", "attentiveness", "ambiance", "atmosphere",
        "cleanliness", "wait time", "reservation process", "drink selection",
        "wine pairing suggestions", "knowledge of the menu", "hospitality"
    ]

    highlights = [
        "The signature dish", "The chef's special", "The dessert selection",
        "Their famous appetizer", "The seasonal menu", "The house specialty",
        "The cocktail program", "The wine list", "The seafood options",
        "Their homemade pasta", "The steak preparation", "The vegetarian options"
    ]

    # Select template based on star rating
    if stars >= 8:  # 8-10 stars
        template = random.choice(positive_templates)
    elif stars >= 5:  # 5-7 stars
        template = random.choice(neutral_templates)
    else:  # 2-4 stars
        template = random.choice(negative_templates)

    # Fill in the template
    review = template.format(
        food_aspect=random.choice(food_aspects),
        service_aspect=random.choice(service_aspects),
        highlight=random.choice(highlights)
    )

    return review


def generate_categories(num_categories):
    """Generate category data"""
    categories = []

    # Food category names
    food_categories = [
        "Appetizers", "Salads", "Soups", "Sandwiches", "Burgers",
        "Pasta", "Pizza", "Seafood", "Steaks", "Vegetarian",
        "Vegan", "Gluten-Free", "Breakfast", "Lunch Specials",
        "Dinner Entrees", "Desserts", "Beverages", "Cocktails",
        "Wine", "Beer", "Kids Menu", "Seasonal Specials",
        "Chef's Recommendations", "Local Favorites"
    ]

    # Ensure we don't try to sample more than what's available
    sample_size = min(num_categories, len(food_categories))
    selected_categories = random.sample(food_categories, sample_size)

    # If we need more categories than our predefined list, generate additional ones
    additional_needed = max(0, num_categories - sample_size)
    for i in range(additional_needed):
        selected_categories.append(f"Special Menu {i+1}")

    for i in range(num_categories):
        created_at = generate_timestamp()
        updated_at = generate_timestamp(start_date=created_at)

        categories.append({
            "id": i + 1,
            "name": selected_categories[i],
            "description": generate_restaurant_description(selected_categories[i]),
            "created_at": created_at,
            "updated_at": updated_at
        })

    return categories


def generate_menu_items(num_items):
    """Generate menu item data"""
    menu_items = []

    # Food names by type to create more realistic menu items
    food_names = {
        "Appetizers": ["Bruschetta", "Mozzarella Sticks", "Calamari", "Spinach Dip", "Buffalo Wings"],
        "Salads": ["Caesar Salad", "Greek Salad", "Cobb Salad", "Caprese Salad", "Garden Salad"],
        "Soups": ["Tomato Bisque", "Clam Chowder", "French Onion", "Chicken Noodle", "Vegetable Soup"],
        "Sandwiches": ["Club Sandwich", "BLT", "Reuben", "Grilled Cheese", "Chicken Wrap"],
        "Burgers": ["Classic Burger", "Cheeseburger", "Veggie Burger", "Bacon Burger", "Mushroom Burger"],
        "Pasta": ["Spaghetti", "Fettuccine Alfredo", "Lasagna", "Ravioli", "Penne Vodka"],
        "Pizza": ["Margherita", "Pepperoni", "Vegetable", "Supreme", "Hawaiian"],
        "Seafood": ["Grilled Salmon", "Shrimp Scampi", "Fish & Chips", "Lobster Tail", "Crab Cakes"],
        "Desserts": ["Chocolate Cake", "Cheesecake", "Apple Pie", "Ice Cream", "Tiramisu"]
    }

    # Flatten the food items list for random selection when needed
    all_foods = []
    for category_foods in food_names.values():
        all_foods.extend(category_foods)

    for i in range(num_items):
        created_at = generate_timestamp()
        updated_at = generate_timestamp(start_date=created_at)

        # Select a random food item or generate a new one if we run out
        if i < len(all_foods):
            name = all_foods[i]
        else:
            food_adjectives = ["House", "Signature", "Chef's", "Classic", "Seasonal",
                               "Special", "Artisanal", "Gourmet", "Traditional", "Ultimate"]
            food_types = ["Plate", "Special", "Delight", "Dish", "Creation",
                          "Selection", "Favorite", "Medley", "Feature", "Specialty"]
            name = f"{random.choice(food_adjectives)} {random.choice(food_types)}"

        price = round(random.uniform(6.99, 29.99), 2)

        menu_items.append({
            "id": i + 1,
            "name": name,
            "description": generate_menu_item_description(name),
            "price": price,
            "image_path": f"/images/menu/{i+1}.jpg",
            "created_at": created_at,
            "updated_at": updated_at
        })

    return menu_items


def generate_menu_item_categories(menu_items, categories):
    """Generate menu item to category relationships"""
    menu_item_categories = []

    # Each menu item belongs to 1-3 categories
    for menu_item in menu_items:
        num_categories = random.randint(1, min(3, len(categories)))
        selected_category_ids = random.sample(
            [cat["id"] for cat in categories], num_categories)

        for category_id in selected_category_ids:
            menu_item_categories.append({
                "menu_item_id": menu_item["id"],
                "category_id": category_id
            })

    return menu_item_categories


def generate_users(num_users):
    """Generate user data"""
    users = []

    # Create at least one admin user
    admin_user = {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "password_hash": generate_password_hash("adminpass123"),
        "is_admin": True,
        "created_at": generate_timestamp(),
        "updated_at": generate_timestamp()
    }
    users.append(admin_user)

    # Generate regular users
    for i in range(1, num_users):
        created_at = generate_timestamp()
        updated_at = generate_timestamp(start_date=created_at)

        users.append({
            "id": i + 1,
            "name": fake.name(),
            "email": fake.email(),
            "password_hash": generate_password_hash(fake.password()),
            "is_admin": False,
            "created_at": created_at,
            "updated_at": updated_at
        })

    return users


def generate_reviews(num_reviews, menu_items, users):
    """Generate review data"""
    reviews = []

    for i in range(num_reviews):
        created_at = generate_timestamp()
        updated_at = generate_timestamp(start_date=created_at)

        # Reviews are between 2-10 stars as per check constraint
        stars = random.randint(2, 10)

        # Select random menu item and user for this review
        menu_item_id = random.choice(menu_items)["id"]
        user_id = random.choice(users)["id"]

        # Generate content based on star rating
        content = generate_review_content(stars)

        reviews.append({
            "id": i + 1,
            "stars": stars,
            "content": content,
            "menu_item_id": menu_item_id,
            "user_id": user_id,
            "created_at": created_at,
            "updated_at": updated_at
        })

    return reviews


def format_sql_timestamp(dt):
    """Format datetime object to SQL timestamp string"""
    if dt is None:
        return "NULL"
    return dt.timestamp()


def format_sql_string(s):
    """Format string for SQL insertion (escape single quotes)"""
    if s is None:
        return "NULL"
    s = s.replace('\'', '\'\'')
    return f"'{s}'"


def format_sql_boolean(b):
    """Format boolean for SQL insertion"""
    if b is None:
        return "NULL"
    return "TRUE" if b else "FALSE"


def format_sql_number(n):
    """Format number for SQL insertion"""
    if n is None:
        return "NULL"
    return str(n)


def generate_sql_output(data):
    """Generate SQL insert statements for all tables"""
    sql_output = []

    # Insert categories
    sql_output.append("-- Categories")
    for category in data["categories"]:
        sql_output.append(
            f"INSERT INTO categories (id, name, description, created_at, updated_at) VALUES ("
            f"{format_sql_number(category['id'])}, "
            f"{format_sql_string(category['name'])}, "
            f"{format_sql_string(category['description'])}, "
            f"{format_sql_timestamp(category['created_at'])}, "
            f"{format_sql_timestamp(category['updated_at'])});"
        )

    sql_output.append("\n-- Menu Items")
    for item in data["menu_items"]:
        sql_output.append(
            f"INSERT INTO menu_items (id, name, description, price, image_path, created_at, updated_at) VALUES ("
            f"{format_sql_number(item['id'])}, "
            f"{format_sql_string(item['name'])}, "
            f"{format_sql_string(item['description'])}, "
            f"{format_sql_number(item['price'])}, "
            f"{format_sql_string(item['image_path'])}, "
            f"{format_sql_timestamp(item['created_at'])}, "
            f"{format_sql_timestamp(item['updated_at'])});"
        )

    sql_output.append("\n-- Menu Item Categories")
    for rel in data["menu_item_categories"]:
        sql_output.append(
            f"INSERT INTO menu_item_categories (menu_item_id, category_id) VALUES ("
            f"{format_sql_number(rel['menu_item_id'])}, "
            f"{format_sql_number(rel['category_id'])});"
        )

    sql_output.append("\n-- Users")
    for user in data["users"]:
        sql_output.append(
            f"INSERT INTO users (id, name, email, password_hash, is_admin, created_at, updated_at) VALUES ("
            f"{format_sql_number(user['id'])}, "
            f"{format_sql_string(user['name'])}, "
            f"{format_sql_string(user['email'])}, "
            f"{format_sql_string(user['password_hash'])}, "
            f"{format_sql_boolean(user['is_admin'])}, "
            f"{format_sql_timestamp(user['created_at'])}, "
            f"{format_sql_timestamp(user['updated_at'])});"
        )

    sql_output.append("\n-- Reviews")
    for review in data["reviews"]:
        sql_output.append(
            f"INSERT INTO reviews (id, stars, content, menu_item_id, user_id, created_at, updated_at) VALUES ("
            f"{format_sql_number(review['id'])}, "
            f"{format_sql_number(review['stars'])}, "
            f"{format_sql_string(review['content'])}, "
            f"{format_sql_number(review['menu_item_id'])}, "
            f"{format_sql_number(review['user_id'])}, "
            f"{format_sql_timestamp(review['created_at'])}, "
            f"{format_sql_timestamp(review['updated_at'])});"
        )

    return "\n".join(sql_output)


def write_csv_files(data, output_dir):
    """Write data to CSV files"""
    import os

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Write categories CSV
    with open(f"{output_dir}/categories.csv", 'w', newline='') as f:
        writer = csv.DictWriter(
            f, fieldnames=["id", "name", "description", "created_at", "updated_at"])
        writer.writeheader()
        for category in data["categories"]:
            row = category.copy()
            # Convert datetime to string
            row["created_at"] = row["created_at"].strftime(
                '%Y-%m-%d %H:%M:%S') if row["created_at"] else None
            row["updated_at"] = row["updated_at"].strftime(
                '%Y-%m-%d %H:%M:%S') if row["updated_at"] else None
            writer.writerow(row)

    # Write menu_items CSV
    with open(f"{output_dir}/menu_items.csv", 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=[
                                "id", "name", "description", "price", "image_path", "created_at", "updated_at"])
        writer.writeheader()
        for item in data["menu_items"]:
            row = item.copy()
            row["created_at"] = row["created_at"].strftime(
                '%Y-%m-%d %H:%M:%S') if row["created_at"] else None
            row["updated_at"] = row["updated_at"].strftime(
                '%Y-%m-%d %H:%M:%S') if row["updated_at"] else None
            writer.writerow(row)

    # Write menu_item_categories CSV
    with open(f"{output_dir}/menu_item_categories.csv", 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=["menu_item_id", "category_id"])
        writer.writeheader()
        for rel in data["menu_item_categories"]:
            writer.writerow(rel)

    # Write users CSV
    with open(f"{output_dir}/users.csv", 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=[
                                "id", "name", "email", "password_hash", "is_admin", "created_at", "updated_at"])
        writer.writeheader()
        for user in data["users"]:
            row = user.copy()
            row["created_at"] = row["created_at"].strftime(
                '%Y-%m-%d %H:%M:%S') if row["created_at"] else None
            row["updated_at"] = row["updated_at"].strftime(
                '%Y-%m-%d %H:%M:%S') if row["updated_at"] else None
            writer.writerow(row)

    # Write reviews CSV
    with open(f"{output_dir}/reviews.csv", 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=[
                                "id", "stars", "content", "menu_item_id", "user_id", "created_at", "updated_at"])
        writer.writeheader()
        for review in data["reviews"]:
            row = review.copy()
            row["created_at"] = row["created_at"].strftime(
                '%Y-%m-%d %H:%M:%S') if row["created_at"] else None
            row["updated_at"] = row["updated_at"].strftime(
                '%Y-%m-%d %H:%M:%S') if row["updated_at"] else None
            writer.writerow(row)


def write_json_files(data, output_dir):
    """Write data to JSON files"""
    import os
    import json

    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Helper function to convert datetime objects to strings
    def convert_dates(obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        return obj

    # Write individual JSON files
    for table_name, table_data in data.items():
        # Convert datetime objects to strings for JSON serialization
        serializable_data = json.loads(
            json.dumps(table_data, default=convert_dates)
        )

        with open(f"{output_dir}/{table_name}.json", 'w') as f:
            json.dump(serializable_data, f, indent=2)

    # Write a combined JSON file with all data
    with open(f"{output_dir}/all_data.json", 'w') as f:
        serializable_data = json.loads(
            json.dumps(data, default=convert_dates)
        )
        json.dump(serializable_data, f, indent=2)


def main():
    """Main function to generate and output the synthetic data"""
    parser = argparse.ArgumentParser(
        description='Generate synthetic data for restaurant database')
    parser.add_argument('--num-categories', type=int, default=DEFAULT_CONFIG["num_categories"],
                        help=f'Number of categories to generate (default: {DEFAULT_CONFIG["num_categories"]})')
    parser.add_argument('--num-menu-items', type=int, default=DEFAULT_CONFIG["num_menu_items"],
                        help=f'Number of menu items to generate (default: {DEFAULT_CONFIG["num_menu_items"]})')
    parser.add_argument('--num-users', type=int, default=DEFAULT_CONFIG["num_users"],
                        help=f'Number of users to generate (default: {DEFAULT_CONFIG["num_users"]})')
    parser.add_argument('--num-reviews', type=int, default=DEFAULT_CONFIG["num_reviews"],
                        help=f'Number of reviews to generate (default: {DEFAULT_CONFIG["num_reviews"]})')
    parser.add_argument('--output-format', choices=['sql', 'csv', 'json'], default=DEFAULT_CONFIG["output_format"],
                        help=f'Output format (default: {DEFAULT_CONFIG["output_format"]})')
    parser.add_argument('--output-dir', default=DEFAULT_CONFIG["output_dir"],
                        help=f'Output directory for CSV/JSON files (default: {DEFAULT_CONFIG["output_dir"]})')
    parser.add_argument('--output-file', default=None,
                        help='Output file for SQL (default: stdout)')

    args = parser.parse_args()

    print(f"Generating synthetic data...")
    print(f"  Categories: {args.num_categories}")
    print(f"  Menu Items: {args.num_menu_items}")
    print(f"  Users: {args.num_users}")
    print(f"  Reviews: {args.num_reviews}")

    # Generate the data
    categories = generate_categories(args.num_categories)
    menu_items = generate_menu_items(args.num_menu_items)
    menu_item_categories = generate_menu_item_categories(
        menu_items, categories)
    users = generate_users(args.num_users)
    reviews = generate_reviews(args.num_reviews, menu_items, users)

    # Collect all data
    data = {
        "categories": categories,
        "menu_items": menu_items,
        "menu_item_categories": menu_item_categories,
        "users": users,
        "reviews": reviews
    }

    # Output the data in the requested format
    if args.output_format == 'sql':
        sql_output = generate_sql_output(data)
        if args.output_file:
            with open(args.output_file, 'w') as f:
                f.write(sql_output)
            print(f"SQL data written to {args.output_file}")
        else:
            print(sql_output)
    elif args.output_format == 'csv':
        write_csv_files(data, args.output_dir)
        print(f"CSV files written to {args.output_dir}/")
    elif args.output_format == 'json':
        write_json_files(data, args.output_dir)
        print(f"JSON files written to {args.output_dir}/")


if __name__ == "__main__":
    main()
