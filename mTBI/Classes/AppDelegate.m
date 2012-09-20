//
//  AppDelegate.m
//  mTBI
//
//  Created by Roger Reeder on 8/4/11.
//  Copyright __MyCompanyName__ 2011. All rights reserved.
//
#import "Analytics.h"
#import "AppDelegate.h"
#ifdef PHONEGAP_FRAMEWORK
	#import <PhoneGap/PhoneGapViewController.h>
#else
	#import "PhoneGapViewController.h"
#endif

@implementation AppDelegate

@synthesize invokeString;

void uncaughtExceptionHandler(NSException *exception) {
#ifdef DEBUG
    NSLog(@"Error:%@",exception.reason);
#endif
    [Analytics logError:@"Uncaught" message:@"Crash!" exception:exception];
}


- (id) init
{	
	/** If you need to do any extra app-specific initialization, you can do it here
	 *  -jm
	 **/
    return [super init];
}

/**
 * This is main kick off after the app inits, the views and Settings are setup here. (preferred - iOS4 and up)
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSSetUncaughtExceptionHandler(&uncaughtExceptionHandler);
    
#ifdef DEBUG
    NSString *analyticsKey = [self getAppSetting:@"Analytics" withKey:@"debugKey"];
#else
    NSString *analyticsKey = [self getAppSetting:@"Analytics" withKey:@"appKey"];
#endif
    NSLog(@"starting analytics session");
	[Analytics init:analyticsKey isEnabled:YES];
	if (iOSCheck >0) {
        NSNumber *iOSCheckValue = [NSNumber numberWithInt:iOSCheck];
        NSArray *keys = [NSArray arrayWithObjects:@"iOSCheck", nil];
        NSArray *objs = [NSArray arrayWithObjects:iOSCheckValue , nil];
        NSDictionary *dict = [NSDictionary dictionaryWithObjects:objs forKeys:keys];
        [Analytics logEvent:@"iOSCheck" withParameters:dict];
    }
	NSArray *keyArray = [launchOptions allKeys];
	if ([launchOptions objectForKey:[keyArray objectAtIndex:0]]!=nil) 
	{
		NSURL *url = [launchOptions objectForKey:[keyArray objectAtIndex:0]];
		self.invokeString = [url absoluteString];
		NSLog(@"mTBI launchOptions = %@",url);
	}
	
	return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// this happens while we are running ( in the background, or from within our own app )
// only valid if mTBI.plist specifies a protocol to handle
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url 
{
    // must call super so all plugins will get the notification, and their handlers will be called 
	// super also calls into javascript global function 'handleOpenURL'
    return [super application:application handleOpenURL:url];
}

-(id) getCommandInstance:(NSString*)className
{
	/** You can catch your own commands here, if you wanted to extend the gap: protocol, or add your
	 *  own app specific protocol to it. -jm
	 **/
	return [super getCommandInstance:className];
}

/**
 Called when the webview finishes loading.  This stops the activity view and closes the imageview
 */
- (void)webViewDidFinishLoad:(UIWebView *)theWebView 
{
    static int shown = 0;
	// only valid if mTBI.plist specifies a protocol to handle
	if(self.invokeString)
	{
		// this is passed before the deviceready event is fired, so you can access it in js when you receive deviceready
		NSString* jsString = [NSString stringWithFormat:@"var invokeString = \"%@\";", self.invokeString];
		[theWebView stringByEvaluatingJavaScriptFromString:jsString];
	}

    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    if (iOSCheck == 0) {
        bool agreeEULA = [defaults boolForKey:@"agreeEULA"];
        if(shown == 1 && !agreeEULA) {
            [self showEULA:self.viewController];
        }
        shown++;
    } else {
        
        [theWebView removeFromSuperview];
    }
	return [ super webViewDidFinishLoad:theWebView ];
}

- (void)webViewDidStartLoad:(UIWebView *)theWebView 
{
	return [ super webViewDidStartLoad:theWebView ];
}

/**
 * Fail Loading With Error
 * Error - If the webpage failed to load display an error with the reason.
 */
- (void)webView:(UIWebView *)theWebView didFailLoadWithError:(NSError *)error 
{
	return [ super webView:theWebView didFailLoadWithError:error ];
}

/**
 * Start Loading Request
 * This is where most of the magic happens... We take the request(s) and process the response.
 * From here we can re direct links and other protocalls to different internal methods.
 */
- (BOOL)webView:(UIWebView *)theWebView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
{
	return [ super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType ];
}


- (BOOL) execute:(InvokedUrlCommand*)command
{
	return [ super execute:command];
}

- (void)dealloc
{
	[ super dealloc ];
}

- (void)showEULA:(UIViewController *)controller {
    ViewReaderController *vcReader = [ViewReaderController alloc];
	vcReader.view.alpha = 0.0;
    vcReader.title = @"EULA";
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
    UIInterfaceOrientation interfaceOrientation =  (UIInterfaceOrientation)[UIDevice currentDevice].orientation;
	CGRect r = controller.view.frame;
    if(UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
        r.size.width = r.size.height;
        r.size.height = controller.view.frame.size.width;
    } else if(interfaceOrientation == 0) {
        r.size.height = r.size.width;
    }
    vcReader.pixelsPerFrame = 1.0f;
    vcReader.animationInterval = 1.0f / 15.0f;
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
        vcReader.pixelsPerFrame = 1.0f;
        vcReader.animationInterval = 1.0f / 15.0f;
    }
    //vcReader.view.backgroundColor = [UIColor clearColor];
    vcReader.view.backgroundColor = [UIColor colorWithRed:0.0f green:0.0f blue:0.0f alpha:0.5f];
    vcReader.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal;
    vcReader.modalPresentationStyle = UIModalPresentationFullScreen;
	[vcReader loadHTML:@"eula"];
	[vcReader fadeInReader];
    [controller presentModalViewController:vcReader animated:YES];
    [vcReader release];
    
}
#pragma mark -
#pragma mark Utilities

-(NSString *)getAppSetting:(NSString *)group withKey:(NSString *)key {
    NSDictionary *ps = [NSPropertyListSerialization propertyListFromData:[NSData dataWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"mTBI" ofType:@"plist"]] 
                                                        mutabilityOption:NSPropertyListImmutable 
                                                                  format:nil errorDescription:nil];
    NSDictionary *grp = (NSDictionary *)[ps objectForKey:group];
    return (NSString *)[grp objectForKey:key];
    
}


@end
