//
//  PluginFlurry.h
//  mTBI
//
//  Created by Roger Reeder on 8/24/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <PhoneGap/PGPlugin.h>


@interface PluginFlurry : PGPlugin {
    NSString *callbackID;
}
@property (nonatomic, copy) NSString *callbackID;

//Instance Method
- (void)logEvent:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
/*

- (void)logEvent:(NSString *)eventName;
- (void)logEvent:(NSString *)eventName withParameters:(NSDictionary *)parameters;
- (void)logError:(NSString *)errorID message:(NSString *)message exception:(NSException *)exception;
- (void)logError:(NSString *)errorID message:(NSString *)message error:(NSError *)error;

- (void)logEvent:(NSString *)eventName timed:(BOOL)timed;
- (void)logEvent:(NSString *)eventName withParameters:(NSDictionary *)parameters timed:(BOOL)timed;
- (void)endTimedEvent:(NSString *)eventName withParameters:(NSDictionary *)parameters;
*/
@end
