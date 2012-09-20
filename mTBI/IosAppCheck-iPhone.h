//
//  IosAppCheck-iPhone.h
//  IosAppCheck-iPhone
//
//  Created by Robert Kayl on 9/17/11.
//  Copyright 2011 T2. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface IosAppCheck_iPhone : NSObject

+(BOOL) infoOK: (NSBundle*) bundle;
+(BOOL) filesOK: (NSBundle*) bundle;
+(BOOL) fileDateOK: (NSBundle*) bundle;
+(BOOL) phoneOK;
+(BOOL) rootOK;
+(BOOL) debuggerOK;
+(BOOL) hashOK: (NSBundle*) bundle;

@end
