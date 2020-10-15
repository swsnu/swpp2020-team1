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
> > 4. User repeats step 2 and step 3 for every product.
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
> > And user is directed to expiration-date camera view.
> >
> > When user clicks retake-button on expiration-date camera view
> > Then user should be directed to barcode-scanning camera view.
> >
> > When user clicks edit-button on expiration-date camera view
> > Then user should see a barcode-edit-prompt that takes product name and barcode number as input.
> >
> > When user types in barcode number 8801115114154 and product name '냉장 서울우유 1L' on barcode-edit-prompt and clicks Ok-button
> > Then user should see product information "8801115114154 / 냉장 서울우유 1L" on top banner
> > And user should be directed to expiration-date camera view.
> >
> > When user scans expiration date 2020/10/22 on expiration-date camera view
> > Then user should see product expiration date "2020/10/22" on top banner
> > And user is directed to barcode-scanning camera view.
> >
> > When user clicks retake-button on barcode-scanning camera view
> > Then user should be directed to expiration-date camera view.
> >
> > When user clicks edit-button on barcode-scanning camera view
> > Then user should see a expiration-edit-prompt that takes expiration date as input.
> >
> > When user types in expiration date 2020/10/22 on expiration-edit-prompt and clicks Ok-button
> > Then user should see product expiration date "2020/10/22" on top banner
> > And user should be directed to barcode-scanning camera view.
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
> > When user types in 냉장 서울우유 1L in product name input area, 8801115114154 in barcode number input area, 2020/10/22 in exirpation date input area, and clicks manual-add button
> > Then user should see updated product-list page that has (냉장 서울우유 1L, 8801115114154, 2020/10/22) as one of its element.
> >
> > When user clicks edit-button for a product on product list page
> > Then user should see a prompt that takes (product name, barcode number, expiration date) as input.
> >
> > When user types in 냉장 서울우유 500mL in product name input area, 7701115114154 in barcode number input area, 2020/12/22 in exirpation date input area, and clicks Ok button on the edit prompt
> > Then the chosen product should be updated to (냉장 서울우유 500mL, 7701115114154, 2020/12/22).
> > ```
> >
> **Story 3**
> > **Feature:** User wants to get recipe recommendations
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
> > 4. User clicks done button.
> > 5. User is directed to recipe-recommendation-result page.
> > 6. User clicks one of the recipes from the list.
> > 7. User is directed to recipe-detail page.
> > 8. User watches the video and write comments.
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
> >	When user clicks enabled get-recommendation button
> > Then user is directed to preference-choosing page.
> >
> >	When the user chooses vegan option and italian option, and clicks done button
> > Then user is directed to recipe-recommendation-result page.
> >
> > When user clicks “tomato cheese pasta” on the recipe-recommendation-result page
> >	Then user is directed to recipe-detail page.
> >
> > When user in the recipe-detail page clicks play button of the video 
> > Then the video is played
> >
> > When user in the recipe-detail page types in a new comment in comment-input field and clicks create button
> >	Then a new comment is created and the comment-input field is cleared.
> >
> > When the user clicks back button in the (user preference choosing page || recipe recommendation result page || recipe detail page)
> > Then alert with message “Do you want to go back to main page? all your choices will be lost” appears.
> >
> > When the user clicks “yes” on the alert message
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
> > 2. User is directed to community page.
> > 3. User clicks create article button to start to create an article.
> > 4. User writes text for the title and content.
> > 5. User clicks submit article button.
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
> >	Then user is directed to create article page.
> >
> >	When user types "title1" in the title field and "content1" in the content field and clicks submit button
> >	Then the article with the given title and content is created.
> > ```
> **Story 5**
> > **Feature:** User wants to edit her own article in the community
> >  
> > **Actors:** Logged-in user who has written some articles. 
> >  
> > **Precondition:** User should be in his/her own article page.
> >  
> > **Scenario:**
> > ```
> > 1. User clicks edit button.
> > 2. User edits article content.
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
> >	When user types "edited title" in the title field and "edited content" in the content field and clicks submit button
> >	Then the article is updated with the given title and content.
> > ```
> >
> **Story 6**
> > **Feature:** User wants to delete his/her own article in the community
> >  
> > **Actors:** Logged-in user who has written some articles. 
> >  
> > **Precondition:** User should be in his/her own article page.
> >  
> > **Scenario:**
> > ```
> > 1. User clicks delete button.
> > 2. User gets an alert.
> > 3. User clicks confirm deletion button.
> > ```
> >
> > **Acceptance Test:**
> > ```
> >	When user clicks delete article button
> >	Then the alert with the message "Are you sure? Deleting cannot be undone." appears.
> >
> >	When user clicks confirm button on the alert message
> >	Then the article is deleted.
> > ```
> >
> **Story 7**
> > **Feature:** User can read and write comment to the article in the community
> >  
> > **Actors:** Logged-in user
> >  
> > **Precondition:** User should be a member of the service.
> >  
> > **Scenario:**
> > ```
> > 1. User clicks the article title button.
> > 2. User is directed to article-detail page.
> > 3. User writes a text on comment input area.
> > 4. User clicks submit button.
> > 5. User clicks edit or delete button for her comment.
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
> >	Then user is directed to  corresponding article-detail page.
> >
> >	When user writes "comment1" to comment input area and click submit button
> >	Then the comment with the given content is created.
> >
> >	When user clicks edit comment button
> >	Then comment edit prompt appears.
> >
> >	When user types "edited comment" in the prompt and click confirm button
> >	Then the comment is updated with the given content.
> >
> >	When user clicks delete comment button
> >	Then the deletion confirming alert appears
> >
> >	When user clicks confirm deletion button on the alert
> >	Then the comment is deleted.
> > ```



## User Interface Requirements
> Check the link: https://www.figma.com/file/nHGIzFuzR48pIXG319arD5/Foodify?node-id=0%3A1
