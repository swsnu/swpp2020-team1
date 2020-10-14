## Project Abstract<br />
**Foodify** is an all-in-one refrigerator management service, tracking the ingredients you have and sending notifications such as expiration dates and available recipes. Our target customers are anyone who has a refrigerator, from cooking newbies to manias.


## **Customer**<br />

* **Customer**

  * Anyone who owns a refrigerator

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
    
## User Stories  
### Main page  
> **Story 1**
> > **Feature:** User wants to add item automatically through camera scanning
> >  
> > **Actors:** Logged-in user
> >  
> > **Precondition:** User must a member of the service
> >  
> > **Scenario:**
> > ```
> > 1. User clicks add-item button.
> > 2. User scans the product's barcode.
> > 3. User scans the product's expiration date.
> > 4. User repeats step 2 and step 3 for every products.
> > 5. User clicks done button on camera view.
> > 6. User clicks confirm button on product list page.
> > ```
> > **Exceptions:** 
> > ```
> > (1) When the product's barcode is not recognized correctly, then user clicks retake-button to scan the barcode again.
> > (2) When the product's barcode is not recognized correctly, then user clicks edit-button to manually enter the barcode number.
> > (3) When the product's expiration date is not recognized correctly, then user clicks retake-button to scan the expiration date again.
> > (4) When the product's expiration date is not recognized correctly, then user clicks edit-button to manually enter the expiration date.
> > ```
> > 
> > **Acceptance Test:**
> > ```
> > When user clicks add-item button
> > Then user should see barcode-scanning camera view
> >
> > When user scans barcode number 8801115114154 on barcode-scanning camera view
> > Then user should see product information "8801115114154 / 냉장 서울우유 1L" on top banner
> > And user is automatically directed to expiration-date camera view.
> >
> > When user clicks retake-button on expiration-date camera view
> > Then user should be directed to barcode-scanning camera view.
> >
> > When user clicks edit-button on expiration-date camera view
> > Then user should see a prompt that takes barcode number as input.
> >
> > When user types in barcode number 8801115114154 on barcode-edit-prompt and clicks confirm-button
> > Then user should be directed to expiration-date camera view.
> >
> > When user scans expiration date 2020/10/22 on expiration-date camera view
> > Then user should see product expiration date "2020/10/22" on top banner
> > And user is automatically directed to barcode-scanning camera view.
> >
> > When user clicks retake-button on barcode-scanning camera view
> > Then user should be directed to expiration-date camera view.
> >
> > When user clicks edit-button on barcode-scanning camera view
> > Then user should see a prompt that takes expiration date as input.
> >
> > When user types in expiration date 2020/10/22 on expiration-edit-prompt and clicks confirm-button
> > Then user should be directed to barcode-scanning camera view.
> >
> > When user clicks done-button on barcode-scanning view
> > Then user should see product-list page.
> >
> > When user clicks confirm-button on product-list page
> > Then user should see main page.
> >
> > When user clicks edit-button for a product on product list page
> > Then user should see a prompt that takes both barcode number and expiration date as input.
> > ```
> **Story 2**
> > **Feature:** User wants to add item manually
> >  
> > **Actors:** Logged-in user
> >  
> > **Precondition:** User must a member of the service
> >  
> > **Scenario:**
> > ```
> > 1. User clicks add-item button.
> > 2. User clicks manual-mode button.
> > 3. User is directed to product-list page.
> > 4. User types in barcode number and expiration date on input area.
> > 5. User clicks manual-add button.
> > 6. User repeats step 4 and step 5.
> > 6. User clicks confirm button on product-list page.
> > 
> > **Acceptance Test:**
> > ```
> > When user clicks add-item button
> > Then user should see barcode-scanning camera view
> >
> > When user clicks manual-item button
> > Then user should see product-list page.
> >
> > When user types in (barcode number, expiration date) on input area and clicks manual-add button
> > Then user should see updated product-list page.
> >
> > When user types in (barcode number, expiration date) on input area and clicks manual-add button
> > Then user should see updated product-list page.
> >
> > When user clicks edit-button for a product on product list page
> > Then user should see a prompt that takes both barcode number and expiration date as input.
> > ```

