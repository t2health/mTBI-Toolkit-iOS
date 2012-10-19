/*
 *
 * Mild Tramatic Brain Injury
 *
 * Copyright © 2009-2012 United States Government as represented by
 * the Chief Information Officer of the National Center for Telehealth
 * and Technology. All Rights Reserved.
 *
 * Copyright © 2009-2012 Contributors. All Rights Reserved.
 *
 * THIS OPEN SOURCE AGREEMENT ("AGREEMENT") DEFINES THE RIGHTS OF USE,
 * REPRODUCTION, DISTRIBUTION, MODIFICATION AND REDISTRIBUTION OF CERTAIN
 * COMPUTER SOFTWARE ORIGINALLY RELEASED BY THE UNITED STATES GOVERNMENT
 * AS REPRESENTED BY THE GOVERNMENT AGENCY LISTED BELOW ("GOVERNMENT AGENCY").
 * THE UNITED STATES GOVERNMENT, AS REPRESENTED BY GOVERNMENT AGENCY, IS AN
 * INTENDED THIRD-PARTY BENEFICIARY OF ALL SUBSEQUENT DISTRIBUTIONS OR
 * REDISTRIBUTIONS OF THE SUBJECT SOFTWARE. ANYONE WHO USES, REPRODUCES,
 * DISTRIBUTES, MODIFIES OR REDISTRIBUTES THE SUBJECT SOFTWARE, AS DEFINED
 * HEREIN, OR ANY PART THEREOF, IS, BY THAT ACTION, ACCEPTING IN FULL THE
 * RESPONSIBILITIES AND OBLIGATIONS CONTAINED IN THIS AGREEMENT.
 *
 * Government Agency: The National Center for Telehealth and Technology
 * Government Agency Original Software Designation: mTBI001
 * Government Agency Original Software Title: Mild Tramatic Brain Injury
 * User Registration Requested. Please send email
 * with your contact information to: robert.kayl2@us.army.mil
 * Government Agency Point of Contact for Original Software: robert.kayl2@us.army.mil
 *
 */

#import "Analytics.h"
#import "FlurryAnalytics.h"

static BOOL ANALYTICS_ENABLED = YES;
static BOOL SESSION_STARTED = NO;
static NSString *API_KEY = @"";

@implementation Analytics

+ (void)init:(NSString *)apiKey isEnabled:(BOOL)enabled {
	API_KEY = apiKey;
	ANALYTICS_ENABLED = enabled;
	NSLog(@"[ANALYTICS] session %@",apiKey);
	if(ANALYTICS_ENABLED) {
		SESSION_STARTED = YES;
		[FlurryAnalytics startSession:API_KEY];
	}
}

+ (void)setEnabled:(BOOL)enabled {
	ANALYTICS_ENABLED = enabled;
	
	if(ANALYTICS_ENABLED && !SESSION_STARTED) {
		SESSION_STARTED = YES;
		[FlurryAnalytics startSession:API_KEY];
	}
}


+ (void)logEvent:(NSString *)eventName {
	if(ANALYTICS_ENABLED) {
		[FlurryAnalytics logEvent:eventName];
	}
}

+ (void)logEvent:(NSString *)eventName withParameters:(NSDictionary *)parameters {
	if(ANALYTICS_ENABLED) {
		[FlurryAnalytics logEvent:eventName withParameters:parameters];
	}
}

+ (void)logError:(NSString *)errorID message:(NSString *)message exception:(NSException *)exception {
	if(ANALYTICS_ENABLED) {
		[FlurryAnalytics logError:errorID message:message exception:exception];
	}
}

+ (void)logError:(NSString *)errorID message:(NSString *)message error:(NSError *)error {
	if(ANALYTICS_ENABLED) {
		[FlurryAnalytics logError:errorID message:message error:error];
	}
}

+ (void)logEvent:(NSString *)eventName timed:(BOOL)timed {
	if(ANALYTICS_ENABLED) {
		[FlurryAnalytics logEvent:eventName timed:timed];
	}
}

+ (void)logEvent:(NSString *)eventName withParameters:(NSDictionary *)parameters timed:(BOOL)timed {
	if(ANALYTICS_ENABLED) {
		[FlurryAnalytics logEvent:eventName withParameters:parameters timed:timed];
	}
}

+ (void)endTimedEvent:(NSString *)eventName withParameters:(NSDictionary *)parameters {
	if(ANALYTICS_ENABLED) {
		[FlurryAnalytics endTimedEvent:eventName withParameters:parameters];
	}
}

#pragma mark -
#pragma mark Special Analytic Functions

@end
