# cs1530_group11 Dish Rating System

## **Contributors**

- [Elias Benbourenane](https://github.com/eliasbenb) - Back-end Developer
- [Greyson Barsotti](https://github.com/thegbars) - Front-end Developer
- [Nick Cao](https://github.com/rucNick) - Backend-Developer
- [Xingcheng Qian](https://github.com/Xingcheng03) - Front-end Developer
- [Xingyu Song](https://github.com/songxingyu1118) - Project Management and Testing

## **Project Overview**

This project is a web-based extention prototype that allows users to interact with the menu of a specific organization. Users register and log in, rate and comment on individual menu items, filter dishes based on categories and ratings, view AI generated conclusive reviews, and manage a cart of selected items. 

## **Features**

- **User Authentication**: Users can register, log in, and maintain active sessions with email-based authentication.
- **Menu Item Rating & Commenting**: Users can rate dishes from 1-5 stars and leave comments about their dining experience.
- **Category Filter**: Users can filter menu items by categories (e.g., appetizers, main courses, desserts).
- **Sorting**: Users can sort dishes by rating (highest to lowest, lowest to highest) and by the number of reviews.
- **AI Generated Review**: Users can view AI generated conclusive reviews based on previous user entries.
- **Cart Management**: Users can add items to a cart, view selected items, and remove them if desired.

## **Technologies Used**

- **Frontend**: React.js, HTML, CSS
- **Backend**: Java, Spring Boot
- **Database**: SQLite
- **Authentication**: Email-based authentication
- **CI/CD**: Selenium for automated testing

## **Getting Started**

### **Prerequisites**

To run this project locally, you’ll need the following:

- **Node.js** (for React frontend)
- **Java** (for Spring Boot backend)
- **SQLite** (for the database)

### **Installation Steps**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/yelp-for-one-restaurant.git
   cd yelp-for-one-restaurant

2. **Set up the backend**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     mvn install
     ```
   - Run the backend server:
     ```bash
     mvn spring-boot:run
     ```

3. **Set up the frontend**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the frontend:
     ```bash
     npm start
     ```

4. **Access the app**:
   Open your browser and go to `http://localhost:3000` to access the platform.

## **Usage**

- Register a new user or log in with your existing account.
- Browse the menu, filter by category, and sort by ratings or reviews.
- Rate and comment on dishes.
- Add your favorite dishes to the cart.

## **Future Enhancements**

- Enhance user profile management (view past reviews, ratings, and cart history).
- Support for multiple restaurant menus in the future.
- Better response performance
