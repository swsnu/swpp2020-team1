## Project Abstract<br />
**foodify** is an all-in-one refrigerator management service, tracking the ingredients you have and sending notifications such as expiration dates and available recipes. Our target customers are anyone who has a refrigerator, from cooking newbies to manias.


## **Customer**<br />

* **Customer**

  * Anyone who owns a refrigerator

## **Competitive Landscape**<br />  
The most basic but most important information is the graph and Financial Statements, which is objective information in the stock market.
Stockin' provides this with summarized information.
This will reduce the time that users spend searching for this information.

Also, Stockin' provides news information.
This is subjective information, but it is good information to be able to grasp public opinion and to understand the trends of the companies concerned.
Stockin' categorizes positive and negative articles through NLP and ranks according to the degree of relevant articles to the enterprise.
Eventually users quickly identify them.

By scoring and recommending based on summarized information, users will be able to get help in selecting stocks.

* **Competitive market companies**

  * **Beep**
    * An barcode scanning application that allows customers to manage expiration dates manually.

  * **Yummly**
    * Yummly is a recipe 

Through deep learning, they decide where to sell and buy, thereby narrowing the user's judgment.
However, there are so many factors that determine the price of stocks, and it is unpredictable.
Stockin' helps users build know-how and make better judgments without reducing the width of their judgment.
This will allow users to move on to the best judgment they are satisfied with.

By using **Foodify**'s OCR, user can easilly scan ingredient's expiration date.  



So, what's most **distinct from other competitors** is:
  * Reduce the amount of time users spend searching for stock-related information.
  * Do not narrow the user's judgment by processing objective information.
  * The minimum analysis prediction makes it easier to choose among many stock items.

## **User Stories**<br />
This section will include the specification for your project in the form of user stories. For each user story, you should have at least a Feature and one or more Scenarios, each of which can have one or more Acceptance Tests. Acceptance Tests list one or more acceptance tests with concrete values for the parameters, and concrete assertions that you will make to verify the postconditions. Each user story should also have a field called "Sprint" where you specify in which sprint you implemented or plan to implement this feature.
You should list only the user stories for the previous sprints and those for the current sprint.

At the end of this section you should maintain a bullet list of user stories that you plan to get to in future sprints, with only minimal detail for each such story. We expect that in future sprints some of these items will be promoted to full fledged user stories.
(**Must include in the first version, and must be expanded for future sprints**)

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


