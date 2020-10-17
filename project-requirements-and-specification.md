## Project Abstract<br />
**Foodify** is an all-in-one refrigerator management service, tracking the ingredients users have and sending notifications such as expiration dates. 
**Foodify** recommends recipes based on the user's ingredients and preferences. The recipes contain video that users can follow easily, detailed description about the recipe, and comments from other users such as additional cooking tips. The users can also share their own homemade recipes or any other contents through our community.
Our target customers are anyone who has a refrigerator, from cooking newbies to manias.


## **Customer**<br />

* **General Customer**

  * Anyone who owns a refrigerator
  
* **Specific Customer**
  * People who often fail to remember what's in their fridge and throw away lots of ingredients after expiration date
  * Cooking newbies who have no idea what to do with ingredients in their fridge
  * Cooking manias who want to get some new ideas about what to cook, or share their own recipes and cooking tips with others

## **Competitive Landscape**<br />  
Our main competitor is Beep, a barcode scanning service, and Yummly, a recipe recommendation service. We expect **Foodify** to be more competitive with respect to the following:

  * **Expiration date scanning through OCR**
    * Beep users must manually type in expiration date.
    * **Foodify** allows users to automatically scan expiration date through OCR. 
    
  * **Cusomized item units**
    * Beep cannot manage multiple products with same expiration date.
    * (O) Add (egg, expire: 1/1) (egg, expire: 1/4)
    * (X) Add (egg, expire: 1/1) (egg, expire: 1/1)
    * **Foodify** allows users to manage products in personalized unit.
    * (O) (egg, 2, unit: dozen)
    * (O) (egg, 4, unit: one)
    
  * **Personalized recipe recommendation based on my refrigerator**
    * Yummly does not consider the ingredients the user actually have.
    * **Foodify** recommends recipe based on both user's preference and the ingredients that user have.
    
## Login
> > **Feature:** User wants to sign in
> >  
> > **Actors:** User
> >  
> > **Precondition:** User is logged out, User is member of the service
> >  

### Scenario
- **GIVEN** the User is a member of the service
- **WHEN** the User enters a valid email and password
- **THEN** the User is directed to the `main-page` if the given email and password are valid.

### Acceptance test
```
GIVEN a user with email "a@a.com" password "pw1" is a member of the service
WHEN the User enters "a@a.com" in email input field and "pw1" in password input field and clicks `login-button`
THEN the User is directed to the `main-page`.

GIVEN email "b@b.com" password "pw2" is not a member of the service
WHEN the User enters "b@b.com" in email input field and "pw2" in password input field and clicks `login-button`
THEN the alert with the message "email or password is invalid." pops up.
```

## Sign up
> > **Feature:** User wants to sign up
> >  
> > **Actors:** User who is not a member of the service
> >
> > **Precondition:** User is in `sign-up-page`
> >  

### Scenario
- **GIVEN** the User in `sign-up-page`
- **WHEN** the User enters new (email, password)
- **THEN** the User is directed to the `main-page` if the given email doesn't already exist

### Acceptance test
```
GIVEN user with email "a@a.com" does not exist
WHEN user enters ("a@a.com", "pw1") in (email, password) input field and clicks `create-account-button`
THEN user is directed to the `login-page`.
```

### Exception Test
(1) User tries to sign up with an email that already exists.
```
GIVEN user with email "b@b.com" already exists
WHEN user enters "b@b.com" in email input field
AND `create-account-button` should be  disabled and the text "email already exists" is shown beside the email input field.
```
(2) User doesn't enter email or password.
```
WHEN email or password input field is empty
THEN `create-account-button` should be  disabled
```

## Find Password
> > **Feature:** User wants to find out the password.
> >  
> > **Actors:** User who is a member of the service
> >
> > **Precondition:** User is member of service, User is in `find-password-page`
> >  

### Scenario
- **GIVEN** the User is on `find-password-page`
- **WHEN** the User enters valid email
- **THEN** the password is sent to the user's email
  - **AND** alert message "Your password is sent to your mail" pops up
  - **AND** the User is directed to `login-page`.

### Acceptance test
```
GIVEN the User is in `find-password-page`
AND user with email "a@a.com" and password "pw1" exists
WHEN user enters "a@a.com" in email input field and clicks `find-button`
THEN an email with content "Foodify: Your password is pw1" is sent to a@a.com
AND alert message "Your password is sent to your mail" pops up
AND the User is directed to `login-page`.
```

### Exception Test
(1) User enters the wrong email.
```
GIVEN only a single user with email "a@a.com" exist in the service
WHEN user enters "b@b.com" in email input field and clicks `find-button`
THEN alert message "ID or name is invalid." pops up.
```
(2) User doesn't enter email.
```
WHEN email input field is empty
THEN `find-button` is disabled.
```

## Main page  
> > **Feature:** User gets alarm when the product is about to expire
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User who has a product in his/her fridge
> >  

### Scenario
- **GIVEN** logged-in User
- **WHEN** the the product's expiration date is 3 days left / 1 day left / today
- **THEN** the user gets an alarm.

### Acceptance test
```
GIVEN logged-in User having "냉장서울우유 1L" that expires on 2020/12/25 in his/her fridge,
WHEN the date is 2020/12/22, 2020/12/24, 2020/12/25
THEN the User gets alarm "Expiration 3 days left: 냉장서울우유 1L", "Expiration 1 day left: 냉장서울우유 1L", "Expiration date: 냉장서울우유 1L"
```

> > **Feature:** User gets alarm when there is new comment on his/her article.
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User who has written an article.
> >  

### Scenario
- **GIVEN** logged-in User
- **WHEN** the a new comment is generated in his/her article
- **THEN** the user gets an alarm.

### Acceptance test
```
GIVEN logged-in User who has written an article "article1"
WHEN some user wrote a new comment in "article1"
THEN the User gets alarm "There is a new comment on article 1."
```
## Add ingredients to the fridge (automatic/manual)
> > **Feature:** User can add ingredients
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in
> >  

### Scenario
- **GIVEN** logged-in User
- **WHEN** the User clicks `add-item-button`
  - **AND** the User clicks 'OK' on camera access popup
- **THEN** the User is directed to camera view

### Acceptance test
```
GIVEN the User account[For example, id:"id_in_database", password:"valid_password"],
WHEN the user clicks `add-item-button`
AND the User clicks 'OK' on camera access popup
THEN the User is directed to camera view
```
### Exception Test
(1) User did not allow camera access
```
GIVEN the User account[For example, id:"id_in_database", password:"valid_password"],
WHEN the user clicks `add-item-button`
AND the User clicks `Don't Allow` on camera access popup
THEN the User is directed to the `product-list-page`.
```

> > **Feature:** User can scan item's barcode number
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User allowed camera access, User is on `barcode-scan camera view`
> >  

### Scenario
- **GIVEN** User is on `barcode-scan camera view`
- **WHEN** the User scans the product's barcode
  - **AND** the barcode is recognized correctly
- **THEN** the User is directed to expiration-date camera view
  - **AND** barcode scan result is displayed on top

### Acceptance test
```
GIVEN the User is on `barcode-scan camera view`
WHEN the User scans the product's barcode[For example, barcode: "8801019306495"]
AND the barcode is recognized correctly
THEN the User is directed to `expiration-date camera view`
AND barcode scan result[For example, barcode: "8801019306495", name: "냉장서울우유1L" category: "유제품"] is displayed on top
```

> > **Feature:** User can scan barcode again
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User allowed camera access, User is on `expiration-date camera view`
> >  

### Scenario
- **GIVEN** the User is on `expiration-date camera view`
- **WHEN** the User clicks `retake-button`
- **THEN** the User is directed back to `barcode-scan camera view`

### Acceptance test
```
GIVEN the User is on `expiration-date camera view`
WHEN the User clicks `retake-button`
THEN the User is directed back to `barcode-scan camera view`
```

> > **Feature:** User can manually edit item information (barcode number, item name)
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User allowed camera access, User is on `expiration-date camera view`
> >  

### Scenario
- **GIVEN** the User is on `expiration-date camera view`
- **WHEN** the User clicks `edit-button` on top banner
- **THEN** `edit-barcode-prompt` pops up

- **GIVEN** the `edit-barcode-prompt` popped up on `expiration-date camera view`
- **WHEN** the User fills in both barcode number and item name on input field
  - **AND** the User clicks `OK-button`
- **THEN** the `edit-barcode-prompt` disappears

### Acceptance test
```
GIVEN the User is on `expiration-date camera view`
WHEN the User clicks `edit-button` on top banner
THEN prompt[For example, Product name: _____, Barcode name: _____, Category: ____] pops up

GIVEN the `edit-barcode-prompt` popped up on `expiration-date camera view`
WHEN the User fills in the input field[For example, Product name: "냉장서울우유1L", Barcode name: "8801019306495", Category: "유제품"] 
AND the User clicks `OK-button`
THEN the `edit-barcode-prompt` disappears
```

### Exception Test
(1) Input field for `Product name` is empty
```
GIVEN the edit-barcode-prompt popped up on `expiration-date camera view`
WHEN the User fills in the input field[For example, Product name: "", Barcode name: "", Category: ""] 
THEN the `OK-button` is disabled
AND the placeholder for `Product name` input field is set to "Product Name should be filled in"
```

> > **Feature:** User can scan item's expiration date
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User allowed camera access, User is on  `expiration-date camera view`
> >  

### Scenario
- **GIVEN** the User is on  `expiration-date camera view`
- **WHEN** the User scans the product's expiration date
  - **AND** the expiration date is recognized correctly
- **THEN** the User is directed to `barcode-scan camera view`
  - **AND** expiration date scan result is displayed on top

### Acceptance test
```
GIVEN the User is on  `expiration-date camera view`
WHEN  the User scans the product's expiration date[For example, Expiration date: "2020/10/22"]
AND the expiration date is recognized correctly
THEN the User is directed to `barcode-scan camera view`
AND expiration date scan result[For example, Expiration date: "2020/10/22"] is displayed on top
```

> > **Feature:** User can scan expiration date again
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User allowed camera access, User is on `barcode-scan camera view`
> >  

### Scenario
- **GIVEN** the User is on `barcode-scan camera view`
- **WHEN** the User clicks `retake-button`
- **THEN** the User is directed back to `expiration-date camera view`

### Acceptance test
```
GIVEN the User is on `barcode-scan camera view`
WHEN the User clicks `retake-button`
THEN the User is directed back to `expiration-date camera view`
```

> > **Feature:** User can manually edit expiration date
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User allowed camera access, User is on `barcode-scan camera view`
> >  

### Scenario
- **GIVEN** the User is on `barcode-scan camera view`
- **WHEN** the User clicks `edit-button` on top banner
- **THEN** `edit-expiration-prompt` pops up

- **GIVEN** the `edit-expiration-prompt` popped up on `barcode-scan camera view`
- **WHEN** the User fills in expiration date on input field
  - **AND** the User clicks `OK-button`
- **THEN** the `edit-expiration-prompt` disappears

- **GIVEN** the `edit-expiration-prompt` popped up on `barcode-scan camera view`
- **WHEN** the User checks on no-expiration-checkbox
  - **AND** the User clicks `OK-button`
- **THEN** the `edit-expiration-prompt` disappears

### Acceptance test
```
GIVEN the User is on `barcode-scan camera view`
WHEN the User clicks `edit-button` on top banner
THEN prompt[For example, Expiration date: _____] pops up

GIVEN the `edit-expiration-prompt` popped up on `barcode-scan camera view`
WHEN the User fills in the input field[For example, Expiration date: "2020/10/22"] 
AND the User clicks `OK-button`
THEN the `edit-expiration-prompt` disappears

GIVEN the `edit-expiration-prompt` popped up on `barcode-scan camera view`
WHEN the User checks on no-expiration-checkbox
AND the User clicks `OK-button`
THEN the `edit-expiration-prompt` disappears
```

### Exception Test
(1) Input field for `Expiration date` is empty & checkbox is not checked
```
GIVEN the `edit-expiration-prompt` popped up on `barcode-scan camera view`
WHEN the User does not fill in the input field[For example, Expiration date: "00/00/00"] 
AND the User does not check on no-expiration-checkbox 
THEN the `OK-button` is disabled
AND warning-prompt[For example, "If no expiration date, check on checkbox"] pops up 
```

> > **Feature:** User can stop scanning when clicking on `done-button`
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User allowed camera access, User is on `barcode-scan camera view`
> >  

### Scenario
- **GIVEN** the User is on `barcode-scan camera view`
- **WHEN** the User clicks `done-button`
- **THEN** the User is directed back to `product-list-page`

### Acceptance test
```
GIVEN the User is on `barcode-scan camera view`
WHEN the User clicks `done-button`
THEN the User is directed back to `product-list-page`
```

> > **Feature:** User can stop/continue scanning after checking scanned product list
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User allowed camera access, User is on `product-list-page`
> >  

### Scenario
- **GIVEN** the User is on `product-list-page`
- **WHEN** the User clicks `confirm-button`
- **THEN** the User is directed back to `main-page`

- **GIVEN** the User is on `product-list-page`
- **WHEN** the User clicks `automatic-mode-button`
- **THEN** the User is directed back to `barcode-scan camera view`

### Acceptance test
```
GIVEN the User is on `product-list-page`
WHEN the User clicks `confirm-button`
THEN the User is directed back to `main-page`

GIVEN the User is on `product-list-page`
WHEN the User clicks `automatic-mode-button`
THEN the User is directed back to `barcode-scan camera view`
```

> > **Feature:** User can scan item's barcode number
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User allowed camera access, User is on `barcode-scan camera view`
> >  

### Scenario
- **GIVEN** User is on `barcode-scan camera view`
- **WHEN** the User scans the product's barcode
  - **AND** the barcode is recognized correctly
- **THEN** the User is directed to expiration-date camera view
  - **AND** barcode scan result is displayed on top

### Acceptance test
```
GIVEN the User is on `barcode-scan camera view`
WHEN the User scans the product's barcode[For example, barcode: "8801019306495"]
AND the barcode is recognized correctly
THEN the User is directed to `expiration-date camera view`
AND barcode scan result[For example, barcode: "8801019306495", name: "냉장서울우유1L" category: "유제품"] is displayed on top
```


> > **Feature:** User can delete item in the fridge
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User has some item in the fridge, User is on `main-page`
> >  

### Scenario
- **GIVEN** User is on `main-page`
- **WHEN** the User clicks `delete-button` of the target item
- **THEN** the target item is deleted from the fridge

### Acceptance test
```
GIVEN the User is on `main-page`
WHEN the User clicks `delete-button` of "냉장서울우유1L" in the fridge
THEN the item "냉장서울우유1L" is deleted from the fridge
```
## Personal Recipe Recommendation
> > **Feature:** User can add ingredients to the basket for recipe recommendation
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User's fridge is not empty, User is on `main-page`
> >  

### Scenario
- **GIVEN** the User is on `main-page`
- **WHEN** the User drags and drops ingredients from the fridge to the basket
- **THEN** the `get-recommendation-button` is enabled

- **GIVEN** the `get-recommendation-button` is enabled
- **WHEN** the User clicks enabled `get-recommendation-button`
- **THEN** the User is directed to `preference-choosing-page`.

> > **Acceptance Test:**
> > (1) User watches a recipe recommendation result in `recipe-detail-page`
```
GIVEN the User is on `main-page`
WHEN the User drags ingredients[For example, "tomato","cheese","olive"] from his/her fridge to the basket
THEN `get-recommendation-button` is enabled

GIVEN the `get-recommendation-button` is enabled
WHEN the User clicks enabled `get-recommendation-button`
THEN the User is directed to `preference-choosing-page`.
```

> > **Feature:** User can choose preference options for recipe recommendation
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User's fridge is not empty, User's basket is not empty, User is on `preference-choosing-page`
> >  

### Scenario
- **GIVEN** the User is on `preference-choosing-page`
- **WHEN** the User chooses option
  - **AND** the User clicks `done-button`
- **THEN** the User is directed to `recipe-recommendation-result-page`.

> > **Acceptance Test:**
```
GIVEN the User is on `preference-choosing-page`
WHEN the User chooses option[For example, "Vegan", "Italian"]
AND the User clicks `done-button`
THEN the User is directed to `recipe-recommendation-result-page`.
```

> > **Feature:** User can choose a recipe from the recommendation page
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User's fridge is not empty, User's basket is not empty, User is on `recipe-recommendation-result-page`
> >  

### Scenario
- **GIVEN** the User is on `recipe-recommendation-result-page`
- **WHEN** the User clicks a recipe
- **THEN** the User is directed to the `recipe-detail-page` with corresponding recipe.

- **GIVEN** the User is on `recipe-detail-page`
- **WHEN** the User clicks the play button of the recipe video
- **THEN** the video is played.

> > **Acceptance Test:**
```
GIVEN the User is on `recipe-recommendation-result-page`
WHEN the User clicks a recipe[For example, "tomato cheese pasta"]
THEN the User is directed to `recipe-detail-page` with corresponding recipe.

GIVEN the User is in the `recipe-detail-page`[For example, "tomato cheese pasta"]
WHEN the User clicks the play button of the recipe video
THEN the video is played.
```

> > **Exception Test:**
(1) There exists no recipe for selected ingredients & options
```
GIVEN the User selects ingredients[For example, "Beef", "Egg"] and options[For example, "Vegan"]
WHEN the User clicks `done-button` on `preference-choosing-page`
THEN message "No results for given ingredients & preference" is shown on top of `recipe-recommendation-result-page`
AND popular recipes are shown on `recipe-recommendation-result-page`
```

> > **Feature:** User can write a comment in `recipe-detail-page`
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User is on `recipe-detail-page`
> >  

### Scenario
- **GIVEN** the User is on `recipe-detail-page`
- **WHEN** the User types comment in comment-input field
- ** AND ** the User clicks `submit-button`
- **THEN** a new comment is created
  - **AND** the comment-input field is cleared. 

> > **Acceptance Test:**
```
GIVEN the User is on `recipe-detail-page`[For example, "tomato cheese pasta"]
- **WHEN** the User types comment[For example, "comment1"] in comment-input field
  - **AND** the User clicks `submit-button`
- **THEN** the new comment[For example, "comment1"]  is created
  - **AND** the comment-input field is cleared.
```

> > **Feature:** User can go to `main-page` by clicking `back-button` 
> >  
> > **Actors:** User
> >  
> > **Precondition:** User logged in, User is on `recipe-detail-page`, User is on either one of `user-preference-choosing-page` / `recipe-recommendation-result-page` / `recipe-detail-page`
> >  

### Scenario
- **GIVEN** the User is on either one of `user-preference-choosing-page` / `recipe-recommendation-result-page` / `recipe-detail-page`
- **WHEN** the User clicks `back-button`
- **THEN** alert appears

- **GIVEN** alert is shown on either one of `user-preference-choosing-page` / `recipe-recommendation-result-page` / `recipe-detail-page`
- **WHEN** the User clicks "yes"
- **THEN** the User is directed to the `main-page`

- **GIVEN** alert is shown on either one of `user-preference-choosing-page` / `recipe-recommendation-result-page` / `recipe-detail-page`
- **WHEN** the User clicks "no"
- **THEN** the User stays on the original page

> > **Acceptance Test:**
```
GIVEN the User is on `user-preference-choosing-page`
WHEN the User clicks `back-button`
THEN alert with message[For example, "Do you want to go back to main page? all your choices will be lost"] appears.

GIVEN the User is on `recipe-recommendation-result-page`
WHEN the User clicks `back-button`
THEN alert with message[For example, "Do you want to go back to main page? all your choices will be lost"] appears.

GIVEN the User is on `recipe-detail-page`
WHEN the User clicks `back-button`
THEN alert with message[For example, "Do you want to go back to main page? all your choices will be lost"] appears.

GIVEN alert is shown on `user-preference-choosing-page`
WHEN the User clicks "yes"
THEN the User is directed to the `main-page`

GIVEN alert is shown on `user-preference-choosing-page`
WHEN the User clicks "no"
THEN the User stays on `user-preference-choosing-page`

GIVEN alert is shown on `recipe-recommendation-result-page`
WHEN the User clicks "yes"
THEN the User is directed to the `main-page`

GIVEN alert is shown on `recipe-recommendation-result-page`
WHEN the User clicks "no"
THEN the User stays on `recipe-recommendation-result-page`

GIVEN alert is shown on `recipe-detail-page`
WHEN the User clicks "yes"
THEN the User is directed to the `main-page`

GIVEN alert is shown on `recipe-detail-page`
WHEN the User clicks "no"
THEN the User stays on `recipe-detail-page`
```

## Community
> > **Feature:** User can go to `community-page` from `main-page`
> >  
> > **Actors:** Logged-in user 
> >  
> > **Precondition:** User should be a member of the service, User is on `main-page`
> >  

- **GIVEN** the User is on `main-page`
- **WHEN** the User clicks `community-board-button`
- **THEN**the User is directed to `community-page`.

> > **Acceptance Test:**
> > ```
GIVEN the User is on `main-page`
WHEN the User clicks `community-board-button`
THEN the User is directed to `community-page`.

> > **Feature:** User can create article on community
> >  
> > **Actors:** Logged-in user 
> >  
> > **Precondition:** User should be a member of the service, User is on `community-page`
> >  

- **GIVEN** the User is on `community-page`
- **WHEN** the User clicks `create-article-button`
- **THEN**the User is directed to `create-article-page`.

- **GIVEN** the User is on `create-article-page`
- **WHEN** the User types title and content field
- **THEN**the User is directed to `article-detail-page`.

> > **Acceptance Test:**
> > ```
GIVEN the User is on `community-page`
WHEN the User clicks `create-article-button`
THEN the User is directed to `create-article-page`.

GIVEN the User is on `create-article-page`
WHEN the User types "title1" in the title field and "content1" in the content field 
AND the user clicks `submit-button`
THEN the User is directed to `article-detail-page`
> > ```

> > **Exceptions Test:**
> > (1) When the text input is empty, `submit-button` should be disabled.
> > ```
GIVEN the User is on `create-article-page`
WHEN the User types "" in the title field and "" in the content field 
THEN the `submit-button` is disabled
> > ```
> >
> > **Feature:** User can edit his/her own article in the community
> >  
> > **Actors:** Logged-in user who has written some articles. 
> >  
> > **Precondition:** User should be in his/her own `article-detail-page`.
> >  

### Scenario
- **GIVEN** the User is on `article-detail-page` of his/her own page
- **WHEN** the User clicks `edit-article-button`
- **THEN** the `edit-article-page` opens.

- **WHEN** the User modifies the content of the content input
  - **AND** the User clicks `submit-button`
- **THEN** the article is edited.

### Acceptance test
```
WHEN the User clicks `edit-article-button`
THEN `edit-article-page` opens.
WHEN the User types "edited title" in the title field and "edited content" in the content field and clicks `submit-button`
THEN the article is updated with the given title and content.
```
### Exception test
(1) User clicks back button with edited content
```
GIVEN the User is on `article-edit-page`
WHEN the User types "edited content 2" and clicks `back-button`
THEN the alert with message "Do you want to go back? Edited content will be lost" appears.
WHEN the User clicks `OK-button`
THEN `article-detail-page` opens.

GIVEN the User is on `article-edit-page`
WHEN the User types "edited content 2" and clicks `back-button`
THEN the alert with message "Do you want to go back? Edited content will be lost" appears.
WHEN the User clicks `cancel-button`
THEN the User stays in `article-edit-page`
```
(2) User clicks back button with empty content
```
GIVEN the User is on `article-edit-page`
WHEN the User erase content and clicks `submit-button`
THEN the alert with message "The content of the article cannot be blank." appears.
WHEN the User clicks `OK-button`
THEN the User stays in `article-edit-page`
```
> >
> > **Feature:** User wants to delete his/her own article in the community
> >  
> > **Actors:** Logged-in user who has written some articles. 
> >  
> > **Precondition:** User should be in his/her own `article-detail-page`.
> >  

### Scenario
- **GIVEN** the User is on `article-detail-page` of his/her own article
- **WHEN** the User clicks `delete-article-button`
- **THEN** the alert with message "Are you sure? Deleting cannot be undone." appears.
- **WHEN** the User clicks `OK-button`
- **THEN** the article is deleted.
- **WHEN** the User clicks `cancel-button`
- **THEN** the User stays in `article-detail-page`

**Acceptance Test:**
```
GIVEN the User is on `article-detail-page` of his/her own article
WHEN the User clicks `delete-article-button`
THEN the alert with the message "Are you sure? Deleting cannot be undone." appears.
WHEN the User clicks `OK-button` on the alert message
THEN the article is deleted.
WHEN the User clicks `cancel-button` on the alert message
THEN the User stays in `article-detail-page`
```


> > **Feature:** User wants to create a new comment to the article
> >  
> > **Actors:** User
> >
> > **Precondition:** User logged in, User is in `article-detail-page`
> >  

### Scenario
- **GIVEN** the User is in `article-detail-page`
- **WHEN** the User enters comment in comment input field
  - **AND** the User clicks `create-comment-button`
- **THEN** a new comment with the given content is created.

### Acceptance test
```
GIVEN the User is in `article-detail-page`
WHEN the User enters "comment1" in comment input field
AND the User clicks `create-comment-button`
THEN a new comment with content "comment1" is created.
AND the User stays in the current page.
```

### Exception Test
(1) Input field for comment is empty
```
GIVEN the User is in `article-detail-page`
WHEN user enters nothing in comment input field
THEN the `create-comment-button` is disabled.
```


> > **Feature:** User wants to edit a comment he/she created
> >  
> > **Actors:** User
> >
> > **Precondition:** User logged in, User is in `article-detail-page`, User has created a comment in current article-detail page
> >  

### Scenario
- **GIVEN** the User is in `article-detail-page`
  - **AND** there is a comment created by the User
- **WHEN** the User clicks `edit-comment-button` on the comment
- **THEN** `edit-comment-prompt` appears.

- **GIVEN** `edit-comment-prompt` appeared
- **WHEN** the User enters new comment content 
  - **AND** the User clicks `edit-confirm-button`
- **THEN** the comment is edited with the given content.

- **GIVEN** `edit-comment-prompt` appeared
- **WHEN** the User clicks `edit-cancel-button`
- **THEN** the prompt disappears.
  - **AND** the content of the comment isn't edited.

### Acceptance test
```
GIVEN the User is in `article-detail-page`
AND there is a comment with content "comment1" created by the User
WHEN the User clicks `edit-comment-button` on the comment
THEN `edit-comment-prompt` that takes new content as input appears.
AND the initial value of the input field is "comment1".

GIVEN `edit-comment-prompt` appeared
WHEN the User edits the input to "edited comment1"
AND the User clicks `edit-confirm-button`
THEN the content of the comment is edited to "edited comment1"

GIVEN `edit-comment-prompt` appeared
WHEN the User edits the input to "edited comment1"
AND the User clicks `edit-cancel-button`
THEN the prompt disappears
AND the content of the comment remains "comment1"
```

### Exception Test
(1) Input field for comment in `edit-comment-prompt` empty
```
GIVEN `edit-comment-prompt`appeared
WHEN user enters nothing in comment input field
THEN the `edit-confirm-button` is disabled.
```


> > **Feature:** User wants to delete a comment he/she created
> >  
> > **Actors:** User
> >
> > **Precondition:** User logged in, User is in `article-detail-page`, User has created a comment in current article-detail page
> >  

### Scenario
- **GIVEN** the User is in `article-detail-page`
  - **AND** there is a comment created by the User
- **WHEN** the User clicks `delete-comment-button` on the comment
- **THEN** `delete-comment-alert` appears.

- **GIVEN** `delete-comment-alert` appeared
- **WHEN** the User clicks `delete-confirm-button`
- **THEN** the comment is deleted.

- **GIVEN** `delete-comment-alert` appeared
- **WHEN** the User clicks `delete-cancel-button`
- **THEN** the alert disappears.

### Acceptance test
```
GIVEN the User is in `article-detail-page`
AND there is a comment with content "comment1" created by the User
WHEN the User clicks `delete-comment-button` on the comment
THEN `delete-comment-alert` with the message "Are you sure you want to delete the comment?" appears.

GIVEN `delete-comment-alert` appeared
WHEN the User clicks `delete-confirm-button`
THEN the comment is deleted.

GIVEN `delete-comment-alert` appeared
WHEN the User clicks `delete-cancel-button`
THEN the alert disappears.
```













## User Interface Requirements
![UI Specification](https://github.com/swsnu/swpp2020-team1/blob/master/UI%20Specification_Team%201.png)
> For further information, please check the figma link: https://www.figma.com/file/nHGIzFuzR48pIXG319arD5/Foodify?node-id=0%3A1


