Hello, and welcome to BreedEZ.
"You must include a README.md file that explains key features, how to use them, details your design and implementation rationale, and lists unfinished and future work."

Key Features:
This app allows you to find a mate for your dog. You can create you and your dog a profile and edit it anytime, browse other dog profiles, apply filters when browsing and have text conversations with other users.

How to use them:
To start, create a profile by clicking the "Create User" (once created, you can use the login button to access your profile at a later time). Then you will be taken through two forms where you'll be asked to enter information, such as you and your dog's name, your current town, your dog's age, sex and breed, and can write a short description about your dog. Once completed, you'll be taken to the Edit Profile screen, where you can deit any information you just put in. You can access this screen in the app by clicking the "Edit Profile" button on the page header. By clicking the "Browse Dogs" button on the header, you will be greeted with a list of dogs that are the opposite sex to your dog. You are encouraged to click on a dog, and in doing so you'll be shown their full profile with their information displayed on the screen; from here you can go back to browsing through dogs or can message the owner of the dog by clicking the "Message" button at the bottom of their profile. Speaking of, clicking the "Messages" button on the page header will take you to a list of your conversations you've had with other dogs (for a new user, only one conversation will be displayed, which is an example message from the admin profile), and by clicking into them, you'll be taken to the conversation with that user in more detail. You can send the user messages from this screen. Finally, by clicking the "Set Filter" button on the page header, you can apply restrictions on what dogs you see on the "Browse Profiles" screen. 

Design and Implementation Rationale:
For the design, I decided to model the app after grid-based meet-and-greet apps such as Plenty of Fish and Grindr. I thought this would be more user-friendly than match-based apps such as Tinder, as it saves the user the rigamarole of wasting time to find good mates by wading through the matchmaking system (being shown one potential match a time). It was also slightly simpler to implement as keeping/manipulating records of user-user matches is tough and time-consuming to iterate through on a usage basis. I decided to make it a single-page application and keep most of the scripting to one script file where appropriate, because whilst more heavy on the DOM page building aspect of the code, it seemed more conducive to effective scripting rather than passing variables, etc through pages upon pages.

Unfinished/Future work
I think objectively the styling is not fantastic, it does just need the time putting into it to make it look really nice, but some styling options will need some rewrites of the scripting to insert extra template elements, which was out of the scope of the project at the time of writing. In the future, I'd like an image-upload system to be implemented; every profile has an example image (accurate to their dog breed, trust me it took a long time to find/sort them), and this was implemented as a placeholder for a working image-upload system that was not implemented at this stage. I'd also like more options in sending messages to users, such as emojis and images.