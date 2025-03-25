TEST FIXTURE:
1. Firefox browser version >= 105, or Chrome browser version >= 105 is installed and launched.
2. The URL http://localhost:5173/ is open on the web browser.
3. The values of cookies are set to "false".

TEST CASES:

```
IDENTIFIER: TEST-1-GENERSL-INFO-EXIST
TEST CASE: Check that the "LOGO", "Contact Information" and "Location" display properly.
PRECONDITIONS: None.
EXECUTION STEPS: None.
POSTCONDITIONS: "LOGO", "Contact Information" and "Location" display properly.
```

```
IDENTIFIER: TEST-2-CATEGORY-EXIST
TEST CASE: Check that the "Category" buttons are fully displayed.
PRECONDITIONS: None.
EXECUTION STEPS: None.
POSTCONDITIONS: "Category" buttons are fully displayed.
```

```
IDENTIFIER: TEST-3-CART-EXIST
TEST CASE: Check that the "Shopping Cart" button displays properly.
PRECONDITIONS: None.
EXECUTION STEPS: None.
POSTCONDITIONS: "Category" button displays properly.
```

```
IDENTIFIER: TEST-4-AUTH-EXIST
TEST CASE: Check that the "Log In" button displays properly.
PRECONDITIONS: None.
EXECUTION STEPS: None.
POSTCONDITIONS: "Log In" button displays properly.
```

```
IDENTIFIER: TEST-5-MENU-ITEM-EXIST
TEST CASE: Check that the "Menu Items" title and "Menu Items" fully exist in the main page.
PRECONDITIONS: None.
EXECUTION STEPS: None.
POSTCONDITIONS: "Menu Items" title and "Menu Items" fully exist in the main page.
```

```
IDENTIFIER: TEST-6-CATEGORY-REDIRECT
TEST CASE: Check that "Category" link properly redirects to the "Menu Items" section.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Burgers" button.
POSTCONDITIONS: 
1. The webpage redirects to the burger items.
```

```
IDENTIFIER: TEST-7-CATEGORY-COLLAPSE
TEST CASE: Check that "Category" link properly collapse to the "Menu Items" section.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Burgers" button.
POSTCONDITIONS: 
1. The webpage redirects to the burger items and display the collapsed content.
```

```
IDENTIFIER: TEST-8-CART
TEST CASE: Check that "Cart" link properly points to `http://localhost:5173/cart`.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Cart" button.
POSTCONDITIONS: 
1. The href link of the "Cart" points to `http://localhost:5173/cart`.
```

```
IDENTIFIER: TEST-9-AUTH
TEST CASE: Check that "Log In" link properly points to `http://localhost:5173/login`.
PRECONDITIONS: None.
EXECUTION STEPS:
1. Press the "Log In" button.
POSTCONDITIONS: 
1. The href link of the "Cart" points to `http://localhost:5173/login`.
```

```
IDENTIFIER: TEST-10-AUTH-PROMPT-EXIST
TEST CASE: Check that the login prompt at `http://localhost:5173/login dispays properly.
PRECONDITIONS: None.
EXECUTION STEPS: Login prompt at `http://localhost:5173/login dispays properly.
```