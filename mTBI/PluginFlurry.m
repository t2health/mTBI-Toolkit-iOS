//
//  PluginFlurry.m
//  mTBI
//
//  Created by Roger Reeder on 8/24/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

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
