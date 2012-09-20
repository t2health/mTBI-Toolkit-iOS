//
//  viewReaderController.h
//  iBreathe
//
//  Created by Roger Reeder on 7/4/10.
//  Copyright 2010 National Center for Telehealth & Technology. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewReaderController : UIViewController <UIScrollViewDelegate, UIWebViewDelegate> {
	NSTimer *timer;
	NSTimeInterval timeInterval;
	int scrollCounter;
	CGFloat animationInterval;
	CGFloat pixelsPerFrame;
	
	BOOL bScroll;
	
	UIWebView *wvReader;
	UIScrollView *svReader;
	UIImageView *ivTopFader;
	UIImageView *ivBottomFader;
    
    UIButton *bClose;

}
@property (nonatomic, retain) UIWebView *wvReader;
@property (nonatomic, retain) NSTimer *timer;
@property (nonatomic) CGFloat animationInterval;
@property (nonatomic) CGFloat pixelsPerFrame;
@property (nonatomic, retain) UIButton *bClose;

- (void)initDisplay;
- (void)loadHTML:(NSString *)fileName;

- (void)animationHasFinished:(NSString *)animationID finished:(BOOL)finished context:(void *)context;
- (void)fadeOutReader;
- (void)fadeInReader;
- (void)animShowView;

- (void)scroll:(NSTimer *)theTimer;
- (void)startScrolling;
- (void)bClose_Click:(id)sender;
@end
