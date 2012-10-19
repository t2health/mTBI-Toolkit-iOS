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

#import "PluginFlurry.h"
#import "Analytics.h"

@implementation PluginFlurry
@synthesize callbackID;

-(void)logEvent:(NSMutableArray *)arguments withDict:(NSMutableDictionary *)options {
    //The first argument in the arguments parameter is the callbackID.
    //We use this to send data back to the successCallback or failureCallback
    //through PluginResult
    self.callbackID = [arguments pop];
    
    //Get the string that javascript sent us
    NSString *stringObtainedFromJavascript = [arguments objectAtIndex:0];
    
    //Create the message that we wish to send to the javascript
    NSMutableString *stringToReturn = [NSMutableString stringWithString:@"StringReceived:"];
    [stringToReturn appendString:stringObtainedFromJavascript];
    //Create Plugin Result
    PluginResult* pluginResult = [PluginResult resultWithStatus:PGCommandStatus_OK 
                                                messageAsString:[stringToReturn stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding]];

#ifdef DEBUG
    NSLog(@"FlurryPlugin called with action: %@", stringObtainedFromJavascript );
#endif
    //Log event in analytics.
    [Analytics logEvent:stringObtainedFromJavascript];
    [self writeJavascript: [pluginResult toSuccessCallbackString:self.callbackID]];
}
@end
