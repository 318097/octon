### Octon

#### Features

- [x] Expense Manager
  - [x] Set color for types
  - [x] Highlight expense types
  - [x] Default types should not be deletable
  - [x] Highlight expense
  - [ ] Select currency
  - [x] Expense source - HDFC Credit card, HDFC debit card, SIB Debit card, Payment Bank
  - [x] Expense app - GPay, PayTM
  - [ ] Transactions - Do not add them in totals
  - [ ] Bug: Reset sub type when type changes
  - [x] Stats
    - [x] Last 6 months breakdown
    - [x] Last 6 month total
    - [ ] Sub category breakdown
    - [ ] Select range for stats
  - [ ] Last x months major breakdown and statement. set the minimum amount and only show the transactions above that amount
- [x] Tasks - Todos, Goals & Progress
  - [x] Show done items at the bottom
  - [ ] Define custom fields for progress
  - [ ] Disable future dates in progress
- [x] Timeline
  - [ ] Upload images
  - [ ] Pagination, Search
  - [x] Show all the timelines (Color each post by timeline group)
  - [ ] Add timeline post to portfolio
- [x] Scratch pad
  - [ ] Not able to add
  - [ ] Set duration. Post should expire after that duration is crossed
  - [ ]
- [ ] Vocab
  - [ ] Show word of the day
  - [ ] Add your words
- [ ] Quotes
- [ ] Watchlist
- [ ] Tab Sync

#### Todo

- [x] Login with token only when not signed in
- [x] Token login
- [x] Event tracking
- [x] Google analytics
- [x] Categorize expenses - investments, expenses, income
- [x] Graphql loading and error states
- [x] Rename to octon
- [ ] Sentry sourcemaps
- [ ] Add to home screen
- [ ] Add support for tags
- [ ] Settings page
  - [ ] Show basic info
  - [ ] change/reset password

#### Feature description - Scratch Pad

Upload and share content easily. Share & Download texts, links, images without loging in

- Every user can add a post. It can have
  - a expiry date (post should expire after that date)
  - public/private - public means every user can come to your profile and view/download that Post & to access private data, enter a pin (which can be created by the post's owner)
  - Upload feature is done for Notebase app. Make it modular and reuse it.
