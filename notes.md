- you need to add requireUserPermissionOrParentChild middleware to update student by the parent and get it ( and create it ?)

- make the client add the user Id in the header so that you can do a simple query in the user with id and the id of school and the account id in the token and verify the user belong to the school, one simple O(1) query no joins no nothing and maybe you can add the role afterwards

- the whole subject classroom assignment is a mess, if a classroom added you need to sync the assignment and create based on all subject off that grade, if a subject added you need to add assignment for all classroom off that grade,

- make the env variables central, even for local dev, when you clone the project in a new machine, you ll have to make an env file for almost each package which is frustrating (api+web+admin+db+woker, at least), so make a central one so that you can just copy paste one file 