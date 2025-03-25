# cs1530_group11

Group member: Nick Cao; Xingcheng Qian; Xingyu Song; Greyson Barsotti; Elias Benbourenane

# 1. Introduction

1.1 Purpose
This Software Requirements Specification provides a detailed description of the "Community Reviewing for One" platform, which allows customers to rate and review individual menu items at a single restaurant. This document defines the functional and non-functional requirements for the system, including the user interface, database design, and external interfaces.
1.2 Scope
The platform will allow users to:
- Rate individual menu items from a restaurant.
- Leave comments for each dish.
- View aggregated ratings and reviews for each dish.
- Filter dishes by rating, category, and popularity.
It will not handle food orders or provide direct restaurant reservations.
1.3 Definitions, Acronyms, and Abbreviations
• UI: User Interface
• CI/CD: Continuous Integration / Continuous Deployment
• SRS: Software Requirements Specification

# 2. General Description
This section of the SRS should describe the general factors that affect 'the product and its requirements.  It should be made clear that this section does not state specific requirements; it only makes those requirements easier to understand.
2.1 Product Perspective
The platform provides an alternative to traditional restaurant review sites, which focus on overall restaurant ratings. Instead, this platform focuses specifically on individual menu items, offering a more targeted and informative review system for customers and restaurant owners.
2.2 Product Functions
• Dish Rating System: Users can rate each menu item individually.
• Comments Section: Users can leave comments for each dish they rate.
• User Profiles: Users can track their reviews and ratings.
• Search and Filter Options: Users can easily navigate the restaurant’s menu based on dish ratings and popularity.
• Database storage for all information: All information, including user authentication and ratings/ comments would be stored in individual databases for categorization and inspection.
2.3 Constraints, Assumptions and Dependencies
• Dependencies: The platform depends on a stable internet connection to interact with the backend server and access the SQLite database.
• Assumptions: It is assumed that the restaurant will provide a full list of its menu items.
• Constraints: The system needs to be mobile-friendly to ensure accessibility across devices.

# 3. Specific Requirements
This will be the largest and most important section of the SRS.  The customer requirements will be embodied within Section 3.2. Overall, this section 3 will capture the requirements that are used to guide the project’s software design, implementation, and testing.

3.1 External Interface Requirements
3.1.1 Software Interfaces
• The frontend will develop upon React and shadcn.ui, and will communicate with the backend via APIs, using Java and Spring Boot.
• The database will be SQLite, providing storage for user reviews, ratings, and menu item data.
• The testing will be on SeleniumIDE for full stack unit tesing.
3.2 Functional Requirements
This section describes specific features of the software project.  If desired, some requirements may be specified in the use-case format and listed in the Use Cases Section.
3.2.1 <Dish rating system>
Description: Users can rate each dish on a scale (e.g., 1 to 5 stars) and leave comments.
3.2.2 <Comment system>
Description: Users can leave comments for each dish they rate, which will be stored and displayed alongside the dish's rating.

3.2.3 <User authentication system>
Description: Users can create profiles to track their past reviews and ratings.

3.2.4 <Filtering and Sorting system>
Description: Users can filter the menu by rating, popularity, or category to find the best dishes.
3.3 Use Cases
3.3.1 Use Case #1 Rate a dish
Actor: User
Description: A user selects a menu item and assigns a rating, then writes a comment if desired.
3.3.2 Use Case #2 View dish reviews
Actor: User
Description: A user can browse a dish's comments and see its average rating.
3.4 Classes / Objects
3.4.1 <Class / Object #1>

3.4.1.1 Attributes
3.4.1.2 Methods
3.4.2 <Class / Object #2>
…
3.5 Non-Functional Requirements
Non-functional requirements may exist for the following attributes.  Often these requirements must be achieved at a system-wide level rather than at a unit level.  State the requirements in the following sections in measurable terms (e.g., 95% of transaction shall be processed in less than a second, system downtime may not exceed 1 minute per day, > 30 day MTBF value, etc). 
3.5.1 Performance
The website should respond to major interactions within 2 seconds.
3.5.2 Reliability
The platform should have 99% uptime, with minimal downtime for maintenance.

3.5.3 Availability
The platform should be available 24/7.

3.5.4 Security
User data, including ratings and comments, must be securely stored and encrypted.
3.5.5 Maintainability
The system should be modular, allowing easy updates and changes.
3.5.6 Portability
The system should be accessible across different devices, including desktops, tablets, and smartphones.
3.6 Logical Database Requirements
• Data Storage: The SQLite database will store user reviews, ratings, and user profiles.
• Data Integrity: Ratings and comments will be linked to individual users and menu items to ensure accurate and up-to-date data.
3.7 Other Requirements
Catchall section for any additional requirements.
![image](https://github.com/user-attachments/assets/cff8e694-6c1a-46c6-aa71-4f0c8d8f4a3b)
