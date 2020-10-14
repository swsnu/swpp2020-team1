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
> > **Precondition:** User should be a member of the service
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
> > **Precondition:** User should be a member of the service
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
> > ```
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
> >
> **Story 3**
> > **Feature:** User gets recipe recommendations based on the ingredients
> >  
> > **Actors:** Logged-in user 
> >  
> > **Precondition:** User should be a member of the service
> >  
> > **Scenario:**
> > ```
> > 1. User drags and drops the ingredients to use.
> > 2. User clicks get-recommendation button
> > 3. User is directed to preference-choosing page.
> > 3. User chooses various preferences such as vegan and types of cuisine such as italian, Korean.
> > 4. User clicks the search button.
> > 5. User is directed to recipe-recommendation-result page.
> > 6. User clicks one of the recipes from the list.
> > 7. User is directed to recipe-detail page.
> > 8. User watches video and write comments.
> > ```
> > **Exceptions:** 
> > ```
> > (1) When there is no search results with the given ingredients, then the user is informed that there is no relevant search results, and popular videos are shown.
> > ```
> > 
> > **Acceptance Test:**
> > ```
> >	When user adds tomato, cheese, olive from her fridge
> >	Then get-recommendation button is enabled
> >
> >	When user clicks get-recommendation button
> > Then user is directed to preference-choosing page.
> >
> >	When the user chooses vegan option and italian option, and clicks search button
> > Then user is directed to recipe-recommendation-result page, which includes “tomato cheese pasta”
> >
> > When user clicks “tomato cheese pasta”
> >	Then user is directed to recipe-detail page where the user can watch the videos.
> >
> > When the user in the recipe detail page clicks play button of the video 
> > Then the video is played
> >
> > When user types in a new comment in comment-input field and clicks create button
> >	Then a new comment is created and the comment-input field is cleared.
> >
> > When the user clicks back button in the (user preference choosing page || recipe recommendation result page || recipe detail page)
> > Then alert with message “Do you want to go back to main page? all your choices will be lost” appears.
> > When the user clicks “yes”
> > Then user is directed to the main page
> >
> > ```
> **Story 4**
> > **Feature:** User wants to create an article in the community
> >  
> > **Actors:** Logged-in user 
> >  
> > **Precondition:** User should be a member of the service. 
> >  
> > **Scenario:**
> > ```
> > 1. User clicks community board button.
> > 2. User clicks create article button to start to create an article.
> > 3. User writes text for the title and content.
> > 4. User clicks submit article button to submit an article.
> > ```
> >
> > **Exceptions:** 
> > ```
> > (1) When the text input is empty, submit button should be disabled.
> > ```
> > 
> > **Acceptance Test:**
> > ```
> >	When user clicks create article button
> >	Then the create article page opens.
> >
> >	When user types text to the title and content field and clicks submit button
> >	Then the article is created.
> > ```
> **Story 5**
> > **Feature:** User wants to edit her own article in the community
> >  
> > **Actors:** Logged-in user who has written some articles. 
> >  
> > **Precondition:** User should be in her own article page.
> >  
> > **Scenario:**
> > ```
> > 1. User clicks edit button.
> > 2. User edits her article content.
> > 3. User clicks submit button.
> > ```
> >
> > **Exceptions:** 
> > ```
> > (1) When the content is changed, back button should give alert which informs that edited contents will be lost.
> > (2) When the text input is empty, submit button should be disabled.
> > ```
> >
> > **Acceptance Test:**
> > ```
> >	When user clicks edit article button
> >	Then the edit article page opens.
> >
> >	When user changes text and clicks submit button
> >	Then the article is updated.
> > ```
> >
> **Story 6**
> > **Feature:** User wants to delete her own article in the community
> >  
> > **Actors:** Logged-in user who has written some articles. 
> >  
> > **Precondition:** User should be in her own article page.
> >  
> > **Scenario:**
> > ```
> > 1. User clicks delete button.
> > 2. User gets an alert which informs that deleting the article cannot be undone.
> > 3. User clicks confirm deletion button.
> > ```
> >
> > **Acceptance Test:**
> > ```
> >	When user clicks delete article button
> >	Then the alert appears.
> >
> >	When user clicks confirm button
> >	Then the article is deleted.
> > ```
> >
> **Story 7**
> > **Feature:** User can read and comment to the article in the community
> >  
> > **Actors:** Logged-in user
> >  
> > **Precondition:** User should be a member of the service.
> >  
> > **Scenario:**
> > ```
> > 1. User clicks the article title button.
> > 2. Article detail page opens.
> > 3. User writes a text on comment input area.
> > 4. User clicks submit button.
> > 5. User can click edit or delete button for her comment.
> > ```
> >
> > **Exceptions:** 
> > ```
> > (1) When the comment input is empty, submit button should be disabled
> > ```
> >
> > **Acceptance Test:**
> > ```
> >	When user clicks the article title button
> >	Then the corresponding article detail page opens.
> >
> >	When user input text to comment input area
> > And click submit button
> >	Then the comment is created.
> >
> >	When user clicks edit comment button
> >	Then comment edit prompt appears.
> >
> >	When user edit comment in the prompt
> > And click confirm button
> >	Then the comment is updated.
> >
> >	When user clicks delete comment button
> >	Then the deletion confirming alert appears
> >
> >	When user clicks confirm deletion button
> >	Then the comment is deleted.
> > ```



## User Interface Requirements
> Check the link: https://www.figma.com/file/nHGIzFuzR48pIXG319arD5/Foodify?node-id=0%3A1
