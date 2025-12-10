## Auth Router

- POST /signup
- POST /login
- POST /logout

## Profile Router

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## Connection Request Router

- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## User Router

- GET /user/connections
- GET /user/requests/received
- GET /user/feed. -> gets me the profiles of the persons
