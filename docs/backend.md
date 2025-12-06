Module/Service, defining the Controller endpoints, the required Payloads (DTOs), and the Responses.
1. Auth Service (auth.controller.ts)
Responsibility: Handle user registration, login, and security tokens.
Method	Endpoint	Description	Request Payload (DTO)	Response Data
POST	/auth/register	Register new user	{ name: string, phoneNumber: string, ecocashNumber: string, password: string }	{ success: boolean, message: string, userId: string }
POST	/auth/login	Login user	{ phoneNumber: string, password: string }	{ success: boolean, accessToken: string, refreshToken: string, user: UserProfile }
POST	/auth/verify-otp	Verify phone number	{ userId: string, code: string }	{ success: boolean, accessToken: string, refreshToken: string }
POST	/auth/resend-otp	Resend verification code	{ userId: string }	{ success: boolean }
POST	/auth/forgot-password	Request password reset	{ phoneNumber: string }	{ success: boolean, message: string }
POST	/auth/reset-password	Set new password	{ userId: string, code: string, newPassword: string }	{ success: boolean }
NestJS Recommendation: Use @UseGuards(LocalAuthGuard) for login and @UseGuards(JwtAuthGuard) for protected routes. Implement the userId in the payload as a string, but validate it matches the token in the guard for sensitive operations.

2. Circle Service (circles.controller.ts)
Responsibility: Core logic for savings groups, position lottery, and membership.
Method	Endpoint	Description	Request Payload (DTO)	Response Data
POST	/circles	Create a new Mukando circle	{ name: string, description?: string, contributionAmount: number, frequency: 'weekly'|'monthly', maxMembers: number, positionMethod: 'lottery'|'vote', firstContributionDate: Date }	{ circle: CircleDetails, inviteLink: string }
GET	/circles/my-circles	List user's circles	(Query Params: status=active)	{ circles: CircleSummary[] }
GET	/circles/invite/:code	Get circle info via invite link	(None)	{ circle: PublicCircleDetails, isFull: boolean }
POST	/circles/:id/join	Join a circle	{ userId: string, agreedToTerms: boolean }	{ success: boolean, membership: MemberDetails }
GET	/circles/:id	Get full circle dashboard	(None)	{ circle: CircleDetails, members: Member[], timeline: PayoutSchedule[], stats: CircleStats }
GET	/circles/:id/timeline	Visual payout schedule	(None)	{ timeline: { month: string, recipient: string, status: 'paid'|'pending' }[] }

3. Payment Service (payments.controller.ts)
Responsibility: Interface with EcoCash API (Simulated for Hackathon).
Method	Endpoint	Description	Request Payload (DTO)	Response Data
GET	/wallet/balance	Get current wallet balance	(None)	{ balance: number, lastUpdated: Date }
GET	/wallet/transactions	Get history	(Query: page=1, filter=all)	{ transactions: Transaction[] }
POST	/payments/simulate	(Hackathon Only) Mock a payment	{ amount: number, phoneNumber: string, type: 'contribution'|'loan_repay' }	{ success: boolean, transactionId: string, status: 'completed' }
POST	/payments/webhook	Handle EcoCash callbacks	{ reference: string, status: string, pollUrl: string }	{ received: boolean }
Critical Note: Since you cannot use live money easily, build the /payments/simulate endpoint to manually trigger "Successful Payment" events so you can demo the credit score increasing live.

4. Credit Service (credit.controller.ts)
Responsibility: Calculate and display the gamified credit score.
Method	Endpoint	Description	Request Payload (DTO)	Response Data
GET	/credit/score	Get current score & tier	(None)	{ score: number, tier: string, nextTier: { name: string, threshold: number }, breakdown: ScoreFactors }
GET	/credit/history	Get score change log	(Query: page=1)	{ history: { date: Date, event: string, pointsChange: number, scoreAfter: number }[] }

5. Loan Service (loans.controller.ts)
Responsibility: Manage micro-loans from the liquidity pool.
Method	Endpoint	Description	Request Payload (DTO)	Response Data
GET	/loans/eligibility	Check available loans	(None)	{ userScore: number, tiers: LoanTier[] }
POST	/loans/apply	Submit loan application	{ type: 'micro'|'short_term', amount: number, duration: number, purpose: string, disbursementMethod: 'ecocash' }	{ success: boolean, loanId: string, status: 'approved'|'pending' }
GET	/loans/my-loans	List user's loans	(None)	{ activeLoans: Loan[], completedLoans: Loan[], stats: LoanStats }

6. Storefront Service (storefront.controller.ts)
Responsibility: Allow users to sell items (Youth Entrepreneurship).
Method	Endpoint	Description	Request Payload (DTO)	Response Data
POST	/storefronts	Create a store	{ name: string, slug: string, description: string, products: CreateProductDto[] }	{ storefront: StoreDetails, publicUrl: string }
GET	/storefronts/public/:slug	Public view for customers	(None)	{ storefront: PublicStoreDetails, products: Product[] }
POST	/storefronts/:id/orders	Customer places order	{ items: { productId: string, qty: number }[], customerName: string, customerPhone: string }	{ orderId: string, paymentLink: string }
GET	/storefronts/:id/analytics	Vendor dashboard stats	(Query: period=month)	{ revenue: number, orders: number, topProducts: ProductStats[] }

7. Marketplace Service (marketplace.controller.ts)
Responsibility: Gig economy platform (Youth Earnings).
Method	Endpoint	Description	Request Payload (DTO)	Response Data
GET	/gigs	Browse gigs	(Query: category, sort)	{ gigs: GigSummary[], total: number }
POST	/gigs	Post a new gig	{ title: string, description: string, category: string, rate: number, availability: string }	{ gig: GigDetails, isFeatured: boolean }
POST	/gigs/:id/book	Book a provider	{ hours: number, preferredDate: Date, notes: string }	{ bookingId: string, paymentUrl: string }
GET	/gigs/bookings/as-provider	View incoming jobs	(None)	{ pending: Booking[], upcoming: Booking[] }

8. Learning Service (learning.controller.ts)
Responsibility: Financial literacy LMS.
Method	Endpoint	Description	Request Payload (DTO)	Response Data
GET	/learning/content	Get modules list	(Query: tier=established)	{ recommended: Content[], all: Content[] }
GET	/learning/content/:id	Get lesson details	(None)	{ content: LessonContent, isCompleted: boolean }
POST	/learning/progress	Mark lesson complete	{ contentId: string, status: 'completed' }	{ success: boolean, pointsAwarded: number, newScore: number }
GET	/learning/my-progress	Get user stats	(None)	{ completedCount: number, pointsEarned: number, badges: Badge[] }

9. Analytics Service (analytics.controller.ts)
Responsibility: Power the main user dashboard 1.
Method	Endpoint	Description	Request Payload (DTO)	Response Data
GET	/dashboard	Main user overview	(None)	{ user: { name, score, tier }, circles: CircleSummary[], upcomingPayments: PaymentReminder[], recentEarnings: EarningsEntry[] }

10. Notification Service (notifications.controller.ts)
Responsibility: Send updates about payments and loans 2.
Method	Endpoint	Description	Request Payload (DTO)	Response Data
POST	/notifications/subscribe	Register PWA push token	{ endpoint: string, keys: { p256dh: string, auth: string } }	{ success: boolean }
GET	/notifications	Get in-app alerts	(None)	{ notifications: NotificationItem[] }
Recommended Implementation Order (Hackathon Mode)
1.	Auth & Circle Service: Build these first. Without users and circles, the app does nothing.
2.	Dashboard (Analytics): You need the home screen to look populated.
3.	Payment Simulation: Essential to demonstrate the "cycle" completing.
4.	Credit Service: Connect the payment event to the score increase (the "Wow" factor).
5.	Marketplace/Storefront: Build these last if time permits, or mock them with hardcoded data.
