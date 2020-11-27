# Design and Planning
Rev. [1.0.](https://github.com/swsnu/swpp2020-team1/wiki/Design-and-Planning/b44634f577af4df32e21929c31121f738994e0e7) `10/31/2020`  
Rev. [2.0.](https://github.com/swsnu/swpp2020-team1/wiki/Design-and-Planning/0fd3e2b9971f3e84e6e8d09f2253ccd708469d9a) `11/14/2020`  
Rev. [3.0.](https://github.com/swsnu/swpp2020-team1/wiki/Design-and-Planning/ce3ac548dca6c944133f3cfb75191c5d67213205) `11/20/2020`  
Rev. 4.0 `11/27/2020`

## **Member**<br />
Choi Jung In, Lee Jae Seok, So Hyeong Seok, Yang Ki Chang

## **System Architecture**<br />
![System Architecture](https://github.com/swsnu/swpp2020-team1/blob/master/image/System%20Architecture.png)

## **Model**<br />  
Entity-Relationship diagram (E-R Diagram) of our model design is as follows:
![ER Diagram](https://github.com/swsnu/swpp2020-team1/blob/master/image/ER%20Diagram.png)

Rectangle stands for the entity set, and rhombus stands for the relationship set. Numbers stands for cardinalities between two entities, and (n, m) notation means minimum value is n and maximum value is m. Each entity contains its attributes, and the underlined attribute is a primary key for each entity.  

Relational schema diagram based on the E-R Diagram above is as follows:  
![Relational schema diagram](https://github.com/swsnu/swpp2020-team1/blob/master/image/Relational%20Schema%20Diagram.png)

Rectangle stands for the relational schema, and the attributes and core methods are written in each relational schema. Underlined attribute represents primary key, bold attribute represents foreign key, and arrows represent foreign key constraints.  

The description of each model is as follows:

  * **User**
    * This model stores basic information[email, password, nickname] of each user.
    
  * **Item**
    * This model stores basic information[user_id, barcode_num, name, category_id] of each item.
    * `user_id` attribute is the foreign key from User model
    * `barcode_num` attribute is the foreign key from `Barcode` model. If barcode number is not available, its value is set to -1.
    * `name` attribute refers to item name. Default value is automatically set by `BarcodeInfo` model through `barcode_name`. User can change `name` to customize.
    * `container` attribute refers to container of the item. It can be one of [fridge, freezer, shelf].
    * `category_id` attribute is the foreign key from `Category` model.
  * **ItemCount**
    * This model stores user-specific information[expiration_date, count] of the items.
    * For a user, two same items with different expiration date are stored as separate record.
    * If a newly added item has the same [expiration date] with already existing item, `count` is incremented. 
  * **Category**
    * This model stores the food categories available in the service.
    * `name` refers to the narrow category of each item. For example, both "서울우유" and "매일우유" item should be mapped to "우유" category. `category` is necessary for accurate recipe recommendation. 
  * **Barcode**
    * This model stores the mapping between [barcode_number] and [item_name, category_id] of the item.
    * `Barcode` model is used to provide item preview in the `AddItem` page. When user successfully scans the barcode number in camera view, item information should be displayed on top preview. For the scanned `barcode_number`, corresponding `item_name`, `category` is retrieved from the `Barcode` model.
  * **Notification**
    * This model stores notification related information[noti_type, is_read] of each item for the users.
    * `item_count_id` refers to the id of item_count(a specific item with a specific expiration date). Note that we distinguish "Item" and "ItemCount".
    * `expire_date` refers to the expiration date of the specific item.
    * `noti_type` attribute refers to the type of notification: [expire, buy_item]. 
    * `expire` type notification pops up when the item is about to expire within 3 days. When the user clicks `expire` type notification, the user is redirected to `RecipeDetail` page.
    * `buy_item` type notification pops up when there are only one item left. When the user clicks `buy_item` type notification, the user is redirected to a commercial website link to buy the item.
    * `is_read` attribute refers to whether the user has read the notification or not.
  * **Recipe**
    * This model stores the information[title, description, video_url, rating_sum, rating_count, rating_users, ingredients] for each recipe.
    * `rating_sum` attribute refers to the total sum of the user ratings of a recipe, and `rating_count` indicates the number of users who rated the recipe. These two attributes are used to calculate average ratings to be displayed in `RecipeDetail` page.
    * `rating_users` attribute refers to the users who rated this recipe.
    * `ingredients` attribute refers to the ingredients used in this recipe.
  * **RecipeComment**
    * This model stores the information[author_id, recipe_id, content, date] for each comment of a recipe.

## **View**<br />
User interface for our view design is as follows:
![UI Specification](https://user-images.githubusercontent.com/44860976/97774480-757ded80-1b9b-11eb-999e-95547b16d3e6.png)

The functionality and requirement for each page are as follows:
1. SignUp Page ('/signup')
- New user signs up with [email, password, nickname] as inputs
- After password confirmation, user account will be created
2. SignIn Page ('/signin')
- A valid user can sign in with correct [email, password] as inputs
- User can sign up by clicking on `sign_up` button
3. Main Page ('/')
- Users can check the contents of their freezer, fridge, shelf on the Main page.
- Users can click each item to check its information(name, count, expiration date).
- Users can decrease the count of each item by clicking `btn_remove_item` button. If the count becomes zero, item becomes deleted.
- Users can add a new item by clicking `btn_add_item` button. When user clicks `btn_add_item` button, user is asked to allow camera access. If user allows camera access, user is directed to AddItem Page ('/item/add).
- Users can select items and select preference to get recipe recommendation. When user clicks `btn_select_item` button, user can select up to three items. Then the user can select preference[korean, japanese, chinese, western] to get recipe recommendation.
- When user clicks `btn_notification` button, notification dialogue pops up.
4. AddItem Page ('/item/add') 
- Users can consecutively scan the items' barcode number and expiration date through Foodify's OCR API. 
- Initial view is `expiration_scanning` view. User can capture the item's expiration date by touching the screen on `expiration_scanning` view. Then the `barcode_scanning` view appears. When the user scans the barcode, user is automatically directed to the `expiration_scanning` view with a banner on top. Top banner displays the information[expiration date, barcode number, name] of the item added just now. User can edit the information by clicking `btn_edit`. When the user clicks `btn_edit`, editing prompt pops up. User can either click each input fields to manually edit or click `btn_rescan` to rescan the expiration date and barcode number. 
- When user clicks `btn_done`, user is directed to ItemConfirm Page ('/item/confirm)
5. ItemConfirm Page ('/item/confirm')
- Users can view, confirm, and edit the list of items they added.
- If user clicks `btn_webcam_mode` button, user is directed to AddItem Page ('/item/add) 
- Users can manually add an item by entering [name, barcode, expiration date] as input and clicking the `btn_add_item` button.
- If user clicks `btn_confirm` button, user is directed to Main Page ('/')
6. RecipeRecommendation Page ('/recipes')
- Users can look around all the recommended recipes  based on the items in the basket.
- If user clicks 'RecipePreview', user is directed to RecipeDetail Page ('/recipes/:id').
- If user clicks 'btn_back', user is directed to Main Page ('/').
7. RecipeDetail Page ('/recipes/:id')
- Users can look at the details for the selected recipe, and see comments for the corresponding recipe.
- If user clicks 'btn_back', user is directed to RecipeRecommendation Page ('/recipes').
- If user clicks 'btn_add_comment', a new comment written by the user is posted to the RecipeDetail Page.
- If user already wrote a comment, the user can edit or delete the corresponding comment by clicking the 'btn_edit' or 'btn_delete' button.
8. Notification Page ('/notification')
- User should be notified when the items that are going to expire soon, or when another user added a new comment on user's article.
- If user clicks `comment` type notification, redirect to ArticleDetail page (/community/:article_id). 
- If user clicks `expiration` type notification, redirect to Main page('/') with highlight on the item with `item_id`. 

## **Controller**<br />
Controller design between views and models are as follows:
![Controller design](https://github.com/swsnu/swpp2020-team1/blob/master/image/Controller%20Design.png)

## **Frontend Components**<br />
Tables below are the frontend components. The attributes and the methods of each component are listed in each box.
![frontend_components](https://user-images.githubusercontent.com/44860976/97774460-4a939980-1b9b-11eb-8bd5-90b289d18e92.jpg)

## **Frontend Algorithms**<br />
Algorithms required for implementation are written below, based on their component.
1. Main
- `onClickNotificationButton()`: Redirect  to Notification Page ('/notification')
- `onClickCommunityButton()`: Redirect to  Community Page ('/community')
2. ItemContainer
- `onClickAddItemButton()`:  User is asked to allow camera access. If user allows camera access, user is directed to AddItem Page ('/item/add).
3. Basket
- `onItemDropped()`: Add item to the internal state of Basket. Specifically, `category_id` of each item should be stored to utilize in recipe recommendation.
- `onClickFindRecipeButton()`: Redirect to Preference Page ('/preference)
4. Item
- `onClickDeleteButton()`: Call backend API (DELETE /item/count/:itemcount_id) 
5. SignUp
- `onClickSubmitButton(email: string, password: string, nickname: string)`: Call backend API(POST /signup) to create new user with [email, password, nickname]. If signup is successful, redirect to the SignIn Page('/signin').
6. SignIn
- `onClickSignInButton(email: string, password: string)`: Call backend API(POST /signin) to sign in with [email, password]. If the user provided a valid [email, password], redirect to Main Page ('/').
- `onClickSignUpButton`: Redirect to SignUp Page ('/signup')
- `onClickFindPasswordButton`: Redirect to FindPassword Page ('/findpw')
7. SignOut
- `onClickSignOutButton`: Sign out user and redirect to SignIn Page ('/signin')
8. FindPassword
- `onClickMailButton(email: string)`: Send password to user's email.
- `onClickBackButton`: Redirect to SignIn Page ('/signin')
9. CameraView
- `onClickManualModeButton`: Redirect to ItemConfirm Page ('/item/confirm)
- `onClickExpirationDateSkipButton`: Skip expiration date scanning view. Users are automatically directed to the barcode scanning view. 
- `onClickDoneButton`: Redirect to ItemConfirm Page ('/item/confirm)
10. CameraPreview
- `onClickRetakeButton`: User scan either the barcode number or expiration date again
- `onClickEditButton`: User can edit either the barcode number or expiration date.
11. ItemConfirm
- `onClickAddItemButton`: User can manually add an item 
- `onClickWebcamModeButton`: Redirect to AddItem Page ('/item/add') 
- `onClickConfirmButton`: Call backend API (POST /item) and redirect to Main Page ('/')
12. Preference
- `onClickPreferenceTypeButton`: For each preference types(ex. vegan type / cuisine type / allergy type), store the user-selected options as states.
13. PreferenceSelect
- `onClickDoneButton(preferences: string)`: Call backend API (GET /pref/p1_type+p2_type+p3_type) to get recipe_id s of given preferences.
14. RecipeList
- `onClickBackButton`: Redirect to Main Page ('/').
15. RecipePreview
- `onClickRecipePreview`: Redirect to RecipeDetail Page ('/recipes/:id').
16. RecipeDetail
- `onClickBackButton`: Redirect to RecipeList Page ('/recipes').
21. NotificationList
- `onClickBackButton`: Redirect to Main Page ('/').
22. Notification
- `onClickNotification`: If `type` of returned Notification object is `comment`, redirect to ArticleDetail page (/community/:article_id). If `type` of returned Notification object is `expiration`, redirect to Main page('/') with highlight on the item with `item_id`. Call backend API(PUT /noti/:noti_id) to set `is_read` of the clicked notification object as `true`.
23. CommentList
- `onClickAddCommentButton`: Call backend API(POST /article/:article_id/comment) to create new comment on specific article.
24. Comment
- `onClickEditButton`: Call backend API (PUT /article/comment/:comment_id) to update the content of specific comment.
- `onClickDeleteButton`: Call backend API(DELETE /article/comment/:comment_id) to delete the specific comment.

## **Frontend Relations**<br />
Relations between components listed above are as follows:

## **Backend Design**<br />
In the backend design, we use models which have been discussed in the MVC architecture sections.
Detailed specifications of RESTful APIs are as following:

<img src="https://github.com/swsnu/swpp2020-team1/blob/master/image/Backend%20API.png" width="900" />

* User: {email: string, password: string, nickname: string}
* Item: {user_id: integer, barcode_num: integer, name: string, category_id: integer}
* ItemCount: {item_id: integer, container: string, expiration_date: string, count: integer}
* Recipe: {title: string, description: string, video_url: string, rating_sum: integer, rating_count: integer}
* Preference: {recipe_id: integer, vegan_type: string, cuisine_type: string, allergic_type: string}
* RecipeComment: {author_id: integer, recipe_id: integer, content: string, date: string}
* BarcodeInfo: {barcode_num: integer, item_name: string, category: string}
* Notification: {user_id: integer, date: string, type: string, article_id: integer, item_id: integer, is_read: boolean}

## **Implementation Plan**<br />
We are going to make visible outcomes for each sprint. We will work on basic important features first, then move on to more advanced features.
At Sprint 2, we mainly focus on designing the overall architecture of the service. For implementation, we set up basic skeleton code for react frontend and django backend.
At sprint 3, login related features including sign up, sign in, find password will be implemented. Also, add item / display item features will be implemented. These features utilize external API (Barcode recognition, OCR) which will also be implemented at this sprint. At the end of Sprint 3, users will be able to complete the user stories related to the item. 
At sprint 4, selecting ingredients for recipe recommendation and notification features will be implemented.
At sprint 5, recipe recommendation will be displayed properly, and user authentication service will be available.
We will work on CSS styling through all sprints. Assignee for each task will be determined soon.

Testing will be done in the same sprint in which feature is implemented. Both unit tests and integration tests are required.
Detailed implementation plan is shown below. Estimated difficulty is represented with the number of stars(★), and estimated time spent on development is written in hours.


| Page | Feature                      |  Difficulty  |  Time(Hour) |      Sprint    |
|------|------------------------------|--------------|-------------|----------------|
| SignUp | Sign up                      |  ★  |  3 |     5  |
| SignIn | Sign up                      |  ★  |  3 |     5  |
| ItemConfirm | Manually add item                    |  ★  |  5 |     3  |
| AddItem | Connect camera                    |  ★★|  10 |     3  |
|  | Recognize barcode                   |  ★★  |  10 |     3  |
| | Recognize expiration date                 |  ★★★  |  15 |     3  |
| Main(ItemContainer) | Display added items    |  ★★  |  10 |     3  |
|  | Modify quantity of an item      |  ★★  |  5 |    3  |
| Main | Change container of an item |  ★★  |  5 |     4  |
|  | Select items for recipe recommendation  |  ★★  |  10 |     4  |
| Preference | Select preferences   |  ★  |  3 |     4  |
|  Recipe Recommendation | Get search result from user inputs |  ★★  |  15 |   5  |
|  | Display search result                    |  ★★ |  10 |     5  |
|  | Recommend popular recipes for empty search result case   |  ★★  |  5 |     5  |
| RecipeDetail | Display recipe detail      |  ★★  |  10 |     5  |
|  | Add/Show comments  |  ★  |  5 |     5  |
| Notification | Generate notification        |  ★★  |  10 |     4  |
| | Display notification         |  ★★  |  5 |     4  |
| Common | CSS         |  ★  |  20 |     All  |
| | Sign Out         |  ★  |  3 |     5  |

## **Testing Plan**<br />
All tests will be conducted automatically with the testing frameworks specified below. This strategy will ensure more robust and safer codes along the entire project sprints.  

**Unit Testing**  
Every component and module needs to be unit tested before being commited. Code coverage will be kept over 90%. External components(database, JSON requests, OCR API etc.) will be mocked in the unit test.
Frontend (React): Jest, Enzyme
Backend (Django): Python Unit Test

**Functional Testing**  
Every API will be tested with Jest/Enzyme and Python Unit Test. We will focus on the behavior of barcode recognition API and OCR API for expiration date recognition. Also we will test the food recognition API with various kinds of food. Our models will be mocked for API tests. 
Frontend (React): Jest, Enzyme
Backend (Django): Python Unit Test

**Acceptance & Integration Testing**  
We will use Travis CI for the continuous integration.
