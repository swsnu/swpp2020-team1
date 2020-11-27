# Requirements and Specification
Rev. 1.0. `10/17/2020`  
Rev. 1.1. `10/31/2020`  
Rev. 1.2. `11/14/2020`

## Project Abstract<br />
**Foodify** is an all-in-one refrigerator management service. **Foodify** tracks the ingredients inside user's freezer, fridge, shelf and sends notification before the expire date. **Foodify** recommends recipes based on user's ingredients and preferences. **Foodify** provides an open community for the users. Users can easily follow the video & instructions on each recipe page, share their own recipe, comment on other's recipe.

## **Customer**<br />

* **General Customer**

  * Anyone who wants to manage the ingredients they own.
  
* **Specific Customer**
  * People who often fail to remember what's in their fridge and throw away lots of ingredients after expiration date
  * Cooking newbies who have no idea what to do with ingredients in their fridge
  * Cooking manias who want to get some new ideas about what to cook, or share their own recipes and cooking tips with others

## **Competitive Landscape**<br />  
Our main competitors are Beep, a barcode scanning service, and Yummly, a recipe recommendation service. We expect **Foodify** to be more competitive with respect to the following:

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
### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User wants to sign in                     |
| Actors                                   |User|
| Precondition                         |User is logged out, User is member of the service|

### Scenario
- **GIVEN** the User is a member of the service
- **WHEN** the User enters a valid email and password
- **THEN** the User is directed to the `MainPage('/')` if the given email and password are valid.

### Acceptance test
```
GIVEN a user with email "a@a.com" password "pw1" is a member of the service
WHEN the User enters "a@a.com" in email input field and "pw1" in password input field and clicks `login-button`
THEN the User is directed to the `MainPage('/')`.

GIVEN email "b@b.com" password "pw2" is not a member of the service
WHEN the User enters "b@b.com" in email input field and "pw2" in password input field and clicks `login-button`
THEN the alert with the message "email or password is invalid." pops up.
```

## Sign up
**Feature:** User wants to sign up
**Actors:** User who is not a member of the service
**Precondition:** User is in `SignUp Page('/signup')`

### Scenario
- **GIVEN** the User in `SignUp Page('/signup')`
- **WHEN** the User enters new (email, password)
- **THEN** the User is directed to the `MainPage('/')` if the given email doesn't already exist

### Acceptance test
```
GIVEN user with email "a@a.com" does not exist
WHEN user enters ("a@a.com", "pw1") in (email, password) input field and clicks `create-account-button`
THEN user is directed to the `SignIn Page('/signin')`.
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
### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User wants to find out the password.| 
| Actors                                   |User who is a member of the service| 
| Precondition                         | User is member of service, User is in `find-password-page`|

### Scenario
- **GIVEN** the User is on `FindPassword Page('/findpw')`
- **WHEN** the User enters valid email
- **THEN** the password is sent to the user's email
  - **AND** alert message "Your password is sent to your mail" pops up
  - **AND** the User is directed to `SignIn Page('/signin')`.

### Acceptance test
```
GIVEN the User is in `FindPassword Page('/findpw')`
AND user with email "a@a.com" and password "pw1" exists
WHEN user enters "a@a.com" in email input field and clicks `find-button`
THEN an email with content "Foodify: Your password is pw1" is sent to a@a.com
AND alert message "Your password is sent to your mail" pops up
AND the User is directed to `SignIn Page('/signin')`.
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
### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User gets alarm when the product is about to expire|
| Actors                                   |User|
| Precondition                                   |User logged in, User who has a product in his/her fridge|

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

### Meta specs 
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can delete item in the fridge |
| Actors                                   |User |
| Precondition                                   |User logged in, User has some item in the fridge, User is on `Main Page ('/')`|

### Scenario
- **GIVEN** User is on `Main Page ('/')`
- **WHEN** the User clicks `btn_delete` of the target item
- **THEN** the target item is deleted from the fridge

### Acceptance test
```
GIVEN the User is on `Main Page ('/')`
WHEN the User clicks `btn_delete` of "냉장서울우유1L" in the fridge
THEN the item "냉장서울우유1L" is deleted from the fridge
```

## Add items to the fridge (automatic/manual)
### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can go to add item page|
| Actors                                   |User|
| Precondition                                   |User logged in|

### Scenario
- **GIVEN** logged-in User
- **WHEN** the User clicks `AddItemButton`
  - **AND** the User clicks 'OK' on camera access popup
- **THEN** the User is directed to `AddItem Page ('/item/add')`

### Acceptance test
```
GIVEN the User account[For example, id:"id_in_database", password:"valid_password"],
WHEN the user clicks `add-item-button`
AND the User clicks 'OK' on camera access popup
THEN the User is directed to `AddItem Page('/item/add')`
```
### Exception Test
(1) User did not allow camera access
```
GIVEN the User account[For example, id:"id_in_database", password:"valid_password"],
WHEN the user clicks `add-item-button`
AND the User clicks `Don't Allow` on camera access popup
THEN the User is directed to the `ItemConfirm Page('/item/confirm')`.
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can scan item's expiration date|
| Actors                                   |User|
| Precondition                                   |User logged in, User allowed camera access, User is on  `expiration-date camera view` |

### Scenario
- **GIVEN** the User is on `expiration scanning view` of `AddItem Page('/item/add')`
- **WHEN** the User scans the product's expiration date by clicking `capture_expiration_date` button
- **THEN** the User is directed to `barcode scanning view` of `AddItem Page('/item/add')`

### Acceptance test
```
GIVEN the User is on `expiration scanning view` of `AddItem Page('/item/add')`
WHEN  the User scans the product's expiration date[Expiration date: "2020/10/22"]
THEN the User is directed to `barcode scanning view` of `AddItem Page('/item/add')`
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can scan expiration date again|
| Actors                                   |User|
| Precondition                                   |User logged in, User allowed camera access, User completed scanning expiration date and barcode of an item |

### Scenario
- **GIVEN** the User has completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`
- **WHEN** the User clicks `btn_retake_expiration`
- **THEN** the User is directed to `expiration retake view` of `AddItem Page('/item/add')`

### Acceptance test
```
GIVEN the User has completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`
WHEN the User clicks `btn_retake_expiration`
THEN the User is directed to `expiration retake view` of `AddItem Page('/item/add')`

GIVEN the User is in `expiration retake view` of `AddItem Page('/item/add')`
WHEN the User scans the product's expiration date by clicking `capture_expiration_date` button
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result with new expiration date scanning result is displayed on top
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can scan item's barcode number|
| Actors                                   |User|
| Precondition                                   |User logged in, User allowed camera access, User is on `barcode-scan camera view`|

### Scenario
- **GIVEN** User is on `barcode scanning view` of `AddItem Page('/item/add')`
- **WHEN** the User scans the product's barcode
- **THEN** the User is directed to `expiration scanning view` tab of `AddItem Page('/item/add')`
  - **AND** scan result (expiration date and barcode) is displayed on top

### Acceptance test
```
GIVEN the User is on `barcode scanning view` of `AddItem Page('/item/add')`
WHEN the User scans the product's barcode[barcode: "8801019306495"]
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result[barcode: "8801019306495", expiration date: "2020/12/31" name: "냉장서울우유1L" category: "유제품"] is displayed on top
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can scan barcode again|
| Actors                                   |User|
| Precondition                                   |User logged in, User allowed camera access, User completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`|

### Scenario
- **GIVEN** the User has completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`
- **WHEN** the User clicks `btn_retake_barcode` button
- **THEN** the User is directed to `barcode retake view` of `AddItem Page('/item/add')`

### Acceptance test
```
GIVEN the User has completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`
WHEN the User clicks `btn_retake_barcode` button
THEN the User is directed to `barcode retake view` of `AddItem Page('/item/add')`

GIVEN the User is in `barcode retake view` of `AddItem Page('/item/add')`
WHEN the User scans the product's barcode
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result with new barcode scanning result is displayed on top
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can scan retake multiple times|
| Actors                                   |User|
| Precondition                                   |User logged in, User allowed camera access, User completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`|

### Acceptance test
```
(expiration retake 1)
GIVEN the User has completed scanning expiration date and barcode of an item[barcode: "8801019306495", expiration date: "2020/12/31" name: "냉장서울우유1L" category: "우유", count:1] in `AddItem Page('/item/add')`
WHEN the User clicks `btn_retake_expiration` button
THEN the User is directed to `expiration retake view` of `AddItem Page('/item/add')`

WHEN the User scans the product's expiration date["2020/11/11"] by clicking `capture_expiration_date` button
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result with new expiration date scanning result[barcode: "8801019306495", expiration date: "2020/11/11" name: "냉장서울우유1L" category: "우유", count:1] is displayed on top

(expiration retake 2)
WHEN the User clicks `btn_retake_expiration` button
THEN the User is directed to `expiration retake view` of `AddItem Page('/item/add')`

WHEN the User scans the product's expiration date["2020/10/10"] by clicking `capture_expiration_date` button
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result with new expiration date scanning result[barcode: "8801019306495", expiration date: "2020/10/10" name: "냉장서울우유1L" category: "우유", count:1] is displayed on top

(barcode retake 1)
WHEN the User clicks `btn_retake_barcode` button
THEN the User is directed to `barcode retake view` of `AddItem Page('/item/add')`

WHEN the User scans the product's barcode[11111]
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result with new expiration date scanning result[barcode: "11111", expiration date: "2020/11/11" name: "냉장서울우유1L" category: "우유", count:1] is displayed on top

(barcode retake 2)
WHEN the User clicks `btn_retake_barcode` button
THEN the User is directed to `barcode retake view` of `AddItem Page('/item/add')`

WHEN the User scans the product's barcode[22222]
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result with new expiration date scanning result[barcode: "22222", expiration date: "2020/11/11" name: "냉장서울우유1L" category: "우유", count:1] is displayed on top

(expiration retake 3)
WHEN the User clicks `btn_retake_expiration` button
THEN the User is directed to `expiration retake view` of `AddItem Page('/item/add')`

WHEN the User scans the product's expiration date["2020/09/09"] by clicking `capture_expiration_date` button
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result with new expiration date scanning result[barcode: "8801019306495", expiration date: "2020/09/09" name: "냉장서울우유1L" category: "우유", count:1] is displayed on top
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can scan multiple items |
| Actors                                   |User|
| Precondition                                   |User logged in, User allowed camera access, User completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`|

### Acceptance test
```
GIVEN the User has completed scanning expiration date and barcode of an item[barcode: "1103102013", expiration date: "2020/11/11" name: "홈런볼" category: "과자", count:1] in `AddItem Page('/item/add')`
WHEN the User clicks `capture_expiration_date` button and scans expiration date["2020/12/31]
THEN the User is directed to `barcode scanning view` of `AddItem Page('/item/add')`

WHEN the User scans the product's barcode[barcode: "8801019306495"]
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result[barcode: "8801019306495", expiration date: "2020/12/31" name: "냉장서울우유1L" category: "우유", count:1] of the new item is displayed on top

WHEN the User clicks`btn_done` button
THEN the User is directed to `ItemConfirm Page ('/item/confirm')`
AND scanned results of 2 items[{barcode: "1103102013", expiration date: "2020/11/11" name: "홈런볼" category: "과자", count:1}, {barcode: "8801019306495", expiration date: "2020/12/31" name: "냉장서울우유1L" category: "우유", count:1}] are displayed
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can skip expiration scanning |
| Actors                                   |User|
| Precondition                                   |User logged in, User allowed camera access, User is in `expiration scanning view` of `AddItem Page('/item/add')`|

### Scenario
- **GIVEN** the User is in `expiration scanning view` of `AddItem Page('/item/add')`
- **WHEN** the User clicks `skip` button
- **THEN** the User is directed to `barcode scanning view` of `AddItem Page('/item/add')`

### Acceptance test
```
GIVEN the User is in `expiration scanning view` of `AddItem Page('/item/add')`
WHEN the User clicks `skip` button
THEN the User is directed to `barcode scanning view` of `AddItem Page('/item/add')`

WHEN the User scans the product's barcode[barcode: "8801019306495"]
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result[barcode: "8801019306495", expiration date: "{Today's date (default value for expiration date)}" name: "냉장서울우유1L" category: "우유", count:1] is displayed on top
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can skip barcode scanning |
| Actors                                   |User|
| Precondition                                   |User logged in, User allowed camera access, User is in `barcode scanning view` of `AddItem Page('/item/add')`|

### Scenario
- **GIVEN** the User is in `barcode scanning view` of `AddItem Page('/item/add')`
- **WHEN** the User clicks `skip` button
- **THEN** the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`

### Acceptance test
```
GIVEN the User has scanned expiration date["2020/12/31"] and currently in `barcode scanning view` of `AddItem Page('/item/add')`
WHEN the User clicks `skip` button
THEN the User is directed to `expiration scanning view` of `AddItem Page('/item/add')`
AND scan result[barcode: "", expiration date: "2020/12/31" name: "냉장서울우유1L" category: "우유", count:1] is displayed on top
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can manually edit item information |
| Actors                                   |User |
| Precondition                                   |User logged in, User allowed camera access, User completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`|

### Scenario
- **GIVEN** the User completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`
- **WHEN** the User clicks `btn_edit` button on top banner
- **THEN** `edit-barcode-prompt` pops up
  - **AND** initial values of the information are set to the scanned result

- **GIVEN** the `edit-barcode-prompt` popped up on `expiration` tab of `AddItem Page('/item/add')`
- **WHEN** the User fills in item name, barcode, expiration date, category, count
  - **AND** the User clicks `btn_ok` button
- **THEN** the `edit-barcode-prompt` disappears
  - **AND** information of the item is set to given value

### Acceptance test
```
GIVEN the User completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`
WHEN the User clicks `btn_edit` on top banner
THEN prompt[Name: _____, Barcode: _____, Expiration date: ____, Category: ____, Count: ____] pops up

GIVEN the `edit-barcode-prompt` popped up on `AddItem Page('/item/add')`
WHEN the User fills in the input field[Name: "냉장서울우유1L", Barcode: "8801019306495", Expiration date: 2020/12/31, Category: 우유, Count: 3] 
AND the User clicks `btn_ok`
THEN the `edit-barcode-prompt` disappears

GIVEN the `edit-barcode-prompt` popped up on `AddItem Page('/item/add')`
WHEN the User fills in the input field[Name: "냉장서울우유1L", Barcode: "8801019306495", Expiration date: 2020/12/31, Category: 우유, Count: 3] 
AND the User unchecks `expiration_checkbox`
THEN the expiration date input field is emptied

GIVEN the `edit-barcode-prompt` popped up on `AddItem Page('/item/add')`
WHEN the User fills in the input field[Name: "냉장서울우유1L", Barcode: "8801019306495", Expiration date: 2020/12/31, Category: 우유, Count: 1] 
AND the User clicks `decrease_count` button
THEN the count remains 1
```

### Exception Test
(1) Input field for `Product name` is empty
```
GIVEN the edit-barcode-prompt popped up on `AddItem Page('/item/add')`
WHEN the User fills in the input field[Name: "", Barcode: "8801019306495", Expiration date: 2020/12/31, Category: 우유, Count: 3] 
THEN the `btn_ok` button is disabled
AND the placeholder for `Name` input field is set to "Product Name should be filled in"
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can stop scanning when clicking on `btn_done`|
| Actors                                   |User|
| Precondition                                   |User logged in, User allowed camera access, User completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`|

### Scenario
- **GIVEN** the User completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`
- **WHEN** the User clicks `btn_done`
- **THEN** the User is directed to `ItemConfirm Page ('/item/confirm')`

### Acceptance test
```
GIVEN the User completed scanning expiration date and barcode of an item in `AddItem Page('/item/add')`
WHEN the User clicks `btn_done`
THEN the User is directed to `ItemConfirm Page ('/item/confirm')`
```

## Item Confirm
### Meta specs 
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can go back to camera scanning mode |
| Actors                                   |User |
| Precondition                                   |User logged in, User allowed camera access, User is on `ItemConfirm Page ('/item/confirm')`|

### Scenario
- **GIVEN** the User is on `ItemConfirm Page ('/item/confirm')`
- **WHEN** the User clicks `btn_webcam_mode` button
- **THEN** the User is directed back `expiration scanning view` of `AddItem Page('/item/add')`

### Acceptance test
```
GIVEN the User is on `ItemConfirm Page ('/item/confirm')`
WHEN the User clicks `btn_webcam_mode` button
THEN the User is directed back to `barcode` tab of `AddItem Page('/item/add')`
```

### Meta specs 
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can confirm adding items |
| Actors                                   |User |
| Precondition                                   |User logged in, User allowed camera access, User is on `ItemConfirm Page ('/item/confirm')`|

### Scenario
- **GIVEN** the User is on `ItemConfirm Page ('/item/confirm')`
- **WHEN** the User clicks `btn_confirm` button
- **THEN** the User is directed back to `Main Page ('/')`
  **AND** the items are added to DB

### Acceptance test
```
GIVEN the User is on `ItemConfirm Page ('/item/confirm')`
WHEN the User clicks `btn_confirm`
THEN the User is directed back to `Main Page ('/')`
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can manually edit item information |
| Actors                                   |User |
| Precondition                                   |User logged in, User is on `ItemConfirm Page ('/item/confirm')` |

### Scenario
- **GIVEN** the User is on `ItemConfirm Page ('/item/confirm')`
- **WHEN** the User clicks `btn_edit` button on one of the item
- **THEN** `edit-barcode-prompt` pops up
  - **AND** initial values of the input field are set to the original value

- **GIVEN** the `edit-barcode-prompt` popped up on on `ItemConfirm Page ('/item/confirm')`
- **WHEN** the User fills in item name, barcode, expiration date, category, count
  - **AND** the User clicks `btn_ok` button
- **THEN** the `edit-barcode-prompt` disappears
  - **AND** information of the item is set to given value

### Acceptance test
```
GIVEN the User is on `ItemConfirm Page ('/item/confirm')`
WHEN the User clicks `btn_edit` on top banner
THEN prompt[Name: _____, Barcode: _____, Expiration date: ____, Category: ____, Count: ____] pops up

GIVEN the `edit-barcode-prompt` popped up on `ItemConfirm Page ('/item/confirm')`
WHEN the User fills in the input field[Name: "냉장서울우유1L", Barcode: "8801019306495", Expiration date: 2020/12/31, Category: 우유, Count: 3] 
AND the User clicks `btn_ok`
THEN the `edit-barcode-prompt` disappears

GIVEN the `edit-barcode-prompt` popped up on `ItemConfirm Page ('/item/confirm')`
WHEN the User fills in the input field[Name: "냉장서울우유1L", Barcode: "8801019306495", Expiration date: 2020/12/31, Category: 우유, Count: 3] 
AND the User unchecks `expiration_checkbox`
THEN the expiration date input field is emptied

GIVEN the `edit-barcode-prompt` popped up on `ItemConfirm Page ('/item/confirm')`
WHEN the User fills in the input field[Name: "냉장서울우유1L", Barcode: "8801019306495", Expiration date: 2020/12/31, Category: 우유, Count: 1] 
AND the User clicks `decrease_count` button
THEN the count remains 1
```

### Exception Test
(1) Input field for `Product name` is empty
```
GIVEN the edit-barcode-prompt popped up on `ItemConfirm Page ('/item/confirm')`
WHEN the User fills in the input field[Name: "", Barcode: "8801019306495", Expiration date: 2020/12/31, Category: 우유, Count: 3] 
THEN the `btn_ok` button is disabled
AND the placeholder for `Name` input field is set to "Product Name should be filled in"
```

## Personal Recipe Recommendation
### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can move to `select mode` to select ingredients|
| Actors                                   |User|
| Precondition                                   |User logged in, User's fridge is not empty, User is on `normal mode` of `main-page`|

### Scenario
- **GIVEN** the User is on `Main Page ('/')`
- **WHEN** the User clicks `btn_select_ingredients` button
- **THEN** the User is moved to `select mode` and able to select up to 3 items for recipe recommendation

- **GIVEN** the User is on `select mode` without any selected item
- **WHEN** the User clicks `btn_select_ingredients` button
- **THEN** the User is moved from `select mode` to `normal mode`

### Acceptance Test
```
GIVEN the User is on `normal mode` of `Main Page ('/')`
WHEN the User clicks `btn_select_ingredients` button
THEN the User is moved to `select mode` and can select up to 3 items in his/her fridge

GIVEN the User is on `select mode` without any selected item
WHEN the User clicks `btn_select_ingredients` button
THEN the User is moved from `select mode` to `normal mode`
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can submit ingredients and the preference for recipe recommendation|
| Actors                                   |User|
| Precondition                                   |User logged in, User's fridge is not empty, User is on `select mode` of `main-page`|

### Scenario
- **GIVEN** the User selected items for recipe recommendation.
- **WHEN** the User clicks `btn_select_finished` button
- **THEN** the User can select one preference from ["Korean", "Italian", "Japanese", "Chinese"]

- **GIVEN** the User selected items and the preference for recipe recommendation.
- **WHEN** the User clicks `btn_recipe_submit` button
- **THEN** the User is directed to `RecipeRecommendation page ('/recipes')` with selected items and the preference.

### Acceptance Test
```
GIVEN the User selected ["tomato", "cheese", "olive"] from his/her fridge.
WHEN the User clicks `btn_select_finished` button 
AND the User clicks "Italian" preference
AND the User clicks `btn_recipe_submit` button
THEN the User is directed to `RecipeRecommendation page ('/recipes')` with ["tomato", "cheese", "olive"] and "Italian" preference.
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can choose a recipe from the recommendation page |
| Actors                                   |User |
| Precondition                                   |User logged in, User's fridge is not empty, User's basket is not empty, User is on `RecipeRecommendation Page ('/recipes')`.

### Scenario
- **GIVEN** the User is on `RecipeRecommendation Page ('/recipes')`
- **WHEN** the User clicks a recipe
- **THEN** the User is directed to the `RecipeDetail Page ('/recipes/:id')` of the recipe.

- **GIVEN** the User is on `RecipeDetail Page ('/recipes/:id')`
- **WHEN** the User clicks the play button of the recipe video
- **THEN** the video is played.

### Acceptance Test
```
GIVEN the User is on `RecipeRecommendation Page ('/recipes')`
WHEN the User clicks a recipe[For example, "tomato cheese pasta"]
THEN the User is directed to `RecipeDetail Page ('/recipes/:id')` with corresponding recipe.

GIVEN the User is in the `RecipeDetail Page ('/recipes/:id')`[For example, "tomato cheese pasta"]
WHEN the User clicks the play button of the recipe video
THEN the video is played.
```

### Exception Test
(1) There exists no recipe for selected ingredients & options
```
GIVEN the User selects ingredients[For example, "김치", "된장"] and preference[For example, "Italian"]
WHEN the User clicks `btn_recipe_submit` button on `Main Page('/')`
THEN popular recipes are shown on `RecipeRecommendation Page ('/recipes')`
```

### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can write a comment in `RecipeDetail Page ('/recipes/:id')`|
| Actors                                   |User|
| Precondition                                   |User logged in, User is on `RecipeDetail Page ('/recipes/:id')`|

### Scenario
- **GIVEN** the User is on `RecipeDetail Page ('/recipes/:id')`
- **WHEN** the User types comment in comment-input field
- **AND** the User clicks `btn_add_comment`
- **THEN** a new comment is created
  - **AND** the comment-input field is cleared. 

### Acceptance Test
```
GIVEN the User is on `RecipeDetail Page ('/recipes/:id')`[For example, "tomato cheese pasta"]
WHEN the User types comment[For example, "comment1"] in comment-input field
AND the User clicks `btn_add_comment`
THEN the new comment[For example, "comment1"]  is created
AND the comment-input field is cleared.
```

### Meta specs 
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can go to `Main Page ('/')` by clicking `back-button` |
| Actors                                   |User |
| Precondition                                   |User logged in, User is on `RecipeDetail Page ('/recipes/:id')`, User is on either one of `RecipeRecommendation Page ('/recipes')` / `RecipeDetail Page ('/recipes/:id')` |

### Scenario
- **GIVEN** the User is on either one of `RecipeRecommendation Page ('/recipes')` / `RecipeDetail Page ('/recipes/:id')`
- **WHEN** the User clicks `btn_back` button
- **THEN** alert appears

- **GIVEN** alert is shown on either one of `RecipeRecommendation Page ('/recipes')` / `RecipeDetail Page ('/recipes/:id')`
- **WHEN** the User clicks "yes"
- **THEN** the User is directed to the `Main Page('/')`

- **GIVEN** alert is shown on either one of `RecipeRecommendation Page ('/recipes')` / `RecipeDetail Page ('/recipes/:id')`
- **WHEN** the User clicks "no"
- **THEN** the User stays on the original page

### Acceptance Test
```
GIVEN the User is on `RecipeRecommendation Page ('/recipes')`
WHEN the User clicks `btn_back`
THEN alert with message[For example, "Do you want to go back to main page? all your choices will be lost"] appears.

GIVEN the User is on `RecipeDetail Page ('/recipes/:id')`
WHEN the User clicks `btn_back`
THEN alert with message[For example, "Do you want to go back to main page? all your choices will be lost"] appears.

GIVEN alert is shown on `RecipeRecommendation Page ('/recipes')`
WHEN the User clicks "yes"
THEN the User is directed to the `Main Page('/')`

GIVEN alert is shown on `RecipeRecommendation Page ('/recipes')`
WHEN the User clicks "no"
THEN the User stays on `RecipeRecommendation Page ('/recipes')`

GIVEN alert is shown on `RecipeDetail Page ('/recipes/:id')`
WHEN the User clicks "yes"
THEN the User is directed to the `Main Page('/')`

GIVEN alert is shown on `RecipeDetail Page ('/recipes/:id')`
WHEN the User clicks "no"
THEN the User stays on `RecipeDetail Page ('/recipes/:id')`
```

## Notification
### Meta specs
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can go to `Notification Tab` from `Main Page('/')`|
| Actors                                   |Logged-in user |
| Precondition                                   |User should be a member of the service, User is on `Main Page('/')`|

- **GIVEN** the User is on `Main Page('/')`
- **WHEN** the User clicks `btn_notification`
- **THEN**the `Notification Tab` is shown.

### Acceptance Test
```
GIVEN the User is on `Main Page('/')`
WHEN the User clicks `btn_notification`
THEN the User is directed to `Notification Tab`.
```

### Meta specs 
|        Index                             |                                                                        Content                                                                       |
|---------------------------------|:---------------------------------------------------------------------------------------------------------------|
| FeatureName                        |User can click each notification and be redirected to corresponding page|
| Actors                                   |User|
| Precondition                                   |User logged in, User is in `Notification Tab`|

### Scenario
- **GIVEN** the User is in `Notification Tab`
- **WHEN** the User clicks `go_to_mall_button` of `buy_item` type notification
- **THEN** the User should be redirected to the shopping mall link where user can buy the item. 

- **GIVEN** the User is in `Notification Tab`
- **WHEN** the User clicks `expire` type notification
- **THEN** the User should be redirected to `RecipeRecommendation page('/recipes')` with results containing the item.

- **GIVEN** the User is in `Notification Tab`
- **WHEN** the User clicks `recipe` type notification with randomly selected item
- **THEN** the User should be redirected to `RecipeRecommendation page('/recipes')` with results containing the item.

### Acceptance test
```
GIVEN the User is in `Notification Tab`
WHEN the User clicks `go_to_mall_button` of `buy_item` type notification "우유를 거의 다 먹었어요. 새로 주문할까요?"
THEN the User should be redirected to the shopping mall link where user can be 우유. 

GIVEN the User is in `Notification Tab`
WHEN the User clicks `expire` type notification "우유의 유통기한이 12월 17일에 만료됩니다. 얼른 드세요!"
THEN the User should be redirected to `RecipeRecommendation page('/recipes')` with results containing 우유. 

GIVEN the User is in `Notification Tab`
WHEN the User clicks `expire` type notification "우유를 활용한 레시피를 알아보세요!"
THEN the User should be redirected to `RecipeRecommendation page('/recipes')` with results containing 우유. 
```

## User Interface Requirements
![UI Specification](https://github.com/swsnu/swpp2020-team1/blob/master/image/UI%20Specification.png)
> For further information, please check the figma link: https://www.figma.com/file/nHGIzFuzR48pIXG319arD5/Foodify?node-id=0%3A1
