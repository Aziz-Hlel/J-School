-- change the way you use query params to fetch data , instead of making the query key derived from the query params itself , add a zod in the middle , the query key and payload will have the validated schema data so that if a user input size=2 in the browser it ll be corrected and send to the backend correct and as well registered as the query key since it s actually the one that been sent as well as you can update now and correct it in the searchParams without resulting to another refetch or anything since it s decoupled form the query and has a middleware that validates first

-- maybe add a default onError function for useQuery ? but be careful and confirm if it return that without throwing an error and if that good in the first place

-- the disable and enable a bit sloppy , just make sure the user will be disabled afterwards and can login as well if he already logged and have a valid access token

-- you removed the true of check revoked token from the verify token of firebase since it delay so much every single request, which means the disabled and deleted user can technically still use their accounts if they are already logged in till the access token expired meaning one hour tops , what you should od is add a notice in the disable and delete and say this action may take up to one hour to take full effect, then you can add a black list hash in redis to store disabled and deleted accounts id for that hour and reject all tokens coming from them within that hour where some tokens might be still valid if the user were logged in when the disabling or deleting operation happened

-- add proper redis invalidation

-- Add email service l8ter on by default

-- Notification system and can sends a message to all users/ based on role/status

-- keep the types in typesAndFieldsDeclaration file , but instead of actually defining them there , define them in the shared folder and just import them from typesAndFieldsDeclaration so that you all the table component would use those types without losing the import advantages since if you import directly from the shared folder , you ll need to change the importation in a lost of files when you copy the whole folder for another entity, besides you ll be able to use those types in the backend too

-- you can add a user id a Fk to the media table as an extra security measures

-- add update my profile as user and delete my account

-- the repo doesnt actualyy work fine at startup, it missed some setups like pnpm prisma generate and pnpm prisma migrate dev

-- add condition to check if project name exits before runnig docker so that you keep volumes named like this acrroos all you dockerfiles :
volumes:
db_volume:
and since with project name they ll be named like this : ${PROJECT_NAME}\_db_volume

-- just remove the .prod .stage .dev from the dockerfile name , it s useless, the folder name is enough

-- make an internal user service and make authservice depend on it , so that userservice handle http-facing operations

-- maby extract redis to an independant worskpace, maybe ? so that you can use it in the worker and the api

-- add a condition to check if the odcker used is v1 or v2 so you dont fall into the same problem you had with mehyar tryin to deploy your projects to his ec2, you can add the projectName+env directly from the script you make without needing to do it in the env each time,

-- aad prefix seed
