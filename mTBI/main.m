//
//  main.m
//  mTBI
//
//  Created by Roger Reeder on 8/4/11.
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//

#import <UIKit/UIKit.h>
#if TARGET_IPHONE_SIMULATOR
#import "IosAppCheck-simulator.h"
#else
#import "IosAppCheck-iPhone.h"
#endif

int main(int argc, char *argv[]) {
    
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    NSBundle *bundle = [NSBundle mainBundle];
    int a = 0;
#if TARGET_IPHONE_SIMULATOR
    if(![IosAppCheck_simulator infoOK: bundle]) a = 1;
    if(a==0 && ![IosAppCheck_simulator filesOK: bundle]) a = 2;    
    if(a==0 && ![IosAppCheck_simulator fileDateOK: bundle]) a = 3;    
    if(a==0 && ![IosAppCheck_simulator phoneOK]) a = 4;    
    if(a==0 && ![IosAppCheck_simulator rootOK]) a = 5;    
#ifndef DEBUG    
    if(a==0 && ![IosAppCheck_simulator debuggerOK]) a = 7;
#endif
    if(a==0 && ![IosAppCheck_simulator hashOK: bundle]) a = 6;    
#else
    if(![IosAppCheck_iPhone infoOK: bundle]) a = 1;
    if(a==0 && ![IosAppCheck_iPhone filesOK: bundle]) a = 2;    
    if(a==0 && ![IosAppCheck_iPhone fileDateOK: bundle]) a = 3;    
    if(a==0 && ![IosAppCheck_iPhone phoneOK]) a = 4;    
    if(a==0 && ![IosAppCheck_iPhone rootOK]) a = 5;    
#ifndef DEBUG    
    if(a==0 && ![IosAppCheck_iPhone debuggerOK]) a = 7;
#endif
    if(a==0 && ![IosAppCheck_iPhone hashOK: bundle]) a = 6;    
    
#endif
    iOSCheck = a;
    int retVal = UIApplicationMain(argc, argv, nil, @"AppDelegate");
    [pool release];
    return retVal;
}
