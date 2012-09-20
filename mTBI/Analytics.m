//
//  Analytics.m
//  T2TB
//
//  Created by robbiev on 11/3/10.
//  Copyright 2010 National Center for Telehealth & Technology. All rights reserved.
//

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
/*
-(void) flurryStartBreathing:(NSString *)startType{
	Visual *vis = (Visual *)[self.visuals objectAtIndex:self.playerSettings.visual];
	NSDictionary *myParams = [NSDictionary dictionaryWithObjectsAndKeys:startType,@"Start Type",
							  @"Incomplete", @"End Type",
							  [NSString stringWithFormat:@"%d",self.playerSettings.cycles],@"Planned Cycles",
							  [NSString stringWithFormat:@"%d",0],@"Cycles Completed",
							  [NSString stringWithFormat:@"%4.1f",(CGFloat)self.playerSettings.breathSpan/1000.0f],@"Starting Breathe Time",
							  [NSString stringWithFormat:@"%4.1f",(CGFloat)self.playerSettings.breathSpan/1000.0f],@"Ending Breathe Time",
							  [NSString stringWithFormat:@"%@",(self.playerSettings.showGauge ? @"Tube" : @"None")],@"Breathe Metronome",
							  [NSString stringWithFormat:@"%@",vis.name],@"Visual",nil];
	[Analytics logEvent:@"Practice Breathing" withParameters:myParams timed:YES];
}

-(void) flurryEndBreathing:(NSString *)endType{
	if (cycle > self.playerSettings.cycles) {
		cycle--;
	}
	NSDictionary *myParams = [NSDictionary dictionaryWithObjectsAndKeys:endType,@"End Type",
							  [NSString stringWithFormat:@"%d",cycle],@"Cycles Completed",
							  [NSString stringWithFormat:@"%4.1f",(CGFloat)self.playerSettings.breathSpan/1000.0f],@"Ending Breathe Time",nil];
	[Analytics endTimedEvent:@"Practice Breathing" withParameters:myParams];
}

-(void) flurrySubmitVAS:(NSDictionary *)parameters {
	[Analytics logEvent:@"VAS Pre and Post Percent Change" withParameters:parameters];
}
*/

@end
