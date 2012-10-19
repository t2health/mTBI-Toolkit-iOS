/*
 *
 * Mild Traumatic Brain Injury
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
 * Government Agency Original Software Title: Mild Traumatic Brain Injury
 * User Registration Requested. Please send email
 * with your contact information to: robert.kayl2@us.army.mil
 * Government Agency Point of Contact for Original Software: robert.kayl2@us.army.mil
 *
 */

#import "ViewReaderController.h"

@implementation ViewReaderController
@synthesize wvReader;
@synthesize timer;
@synthesize pixelsPerFrame;
@synthesize animationInterval;
@synthesize bClose;


#pragma mark -
#pragma mark Controller Life Cycle
// Implement loadView to create a view hierarchy programmatically, without using a nib.
- (void)loadView {
	pixelsPerFrame = 1.0f;
	animationInterval = 1.0f/30.0f;
	CGRect rect = [[UIScreen mainScreen] bounds];
	UIView *v = [[UIView alloc] initWithFrame:rect];
	v.backgroundColor = [UIColor blackColor];
	self.view = v;
	[self initDisplay];
	[v release];
	[super viewDidLoad];
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return YES;
}
	
- (void)initDisplay {
	/***********************************
	 Initial Learn Content Scroller.... 
	 ***********************************/
	CGFloat shaderHeight = 60.0f;
	CGRect frame = self.view.frame;
	UIScrollView *sv = [[UIScrollView alloc] initWithFrame:frame];
	[sv setContentSize:CGSizeMake(self.view.frame.size.width, 2700.0f)];
	UIEdgeInsets inset;
	inset.left = 0.0f;
	inset.right = 0.0f;
	inset.top = 45.0f;
	inset.bottom = 90.0f;
    [sv setContentInset:inset];
	sv.delegate = self;
	sv.backgroundColor = [UIColor clearColor];
    sv.clipsToBounds = YES;
	
	svReader = sv;
	[self.view addSubview:svReader];
	[sv release];
	
	UIWebView *web = [[UIWebView alloc] initWithFrame:CGRectMake(0.0f, 0.0f, svReader.contentSize.width, svReader.contentSize.height)];
	[web setBackgroundColor:[UIColor clearColor]];
	[web setOpaque:NO];
	wvReader = web;
	wvReader.delegate = self;
    wvReader.clipsToBounds = YES;
	[svReader addSubview:wvReader];
	
	UIImageView *iv = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, frame.size.width, shaderHeight)];
	[iv setImage:[UIImage imageNamed:@"blacktopfade.png"]];
	[self.view addSubview:iv];
	ivTopFader = iv;
	[iv release];
	
	iv = [[UIImageView alloc] initWithFrame:CGRectMake(0, frame.size.height - shaderHeight, frame.size.width, shaderHeight)];
	[iv setImage:[UIImage imageNamed:@"blackbottomfade.png"]];
	[self.view addSubview:iv];
	ivBottomFader = iv;
	[iv release];
	[web release];
	
	timer = nil;
    CGFloat fontSize = 16.0f;
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
        fontSize = 38.0f;
    }
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    frame = CGRectMake(0.0, 0.0, 40.0f, 40.0f);
    button.frame = frame;
    [button setTitle:@"Tap Here To Agree" forState:UIControlStateNormal];
    [button setTitleColor:[UIColor colorWithRed:0.5f green:0.5f blue:0.5f alpha:1.0f] forState:UIControlStateNormal];
    //button.backgroundColor = [UIColor colorWithRed:0.0f green:0.0f blue:0.0f alpha:0.0f];
    
    [button addTarget:self action:@selector(bClose_Click:) forControlEvents:UIControlEventTouchUpInside];
    button.backgroundColor = [UIColor clearColor];
    button.titleLabel.font = [button.titleLabel.font fontWithSize:40.0f * 0.60f];
    button.titleLabel.lineBreakMode = UILineBreakModeCharacterWrap;
    button.enabled = NO;
    button.alpha = 0.4;
    [self.view addSubview:button];
    self.bClose = button;
    [button release];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
	CGSize goodSize = [webView sizeThatFits:CGSizeMake(self.view.frame.size.width, self.view.frame.size.height)];
	if (svReader.frame.size.height >= (goodSize.height)) {
		[svReader setContentSize:CGSizeMake(goodSize.width, svReader.frame.size.height)];
		[webView setFrame:CGRectMake(0.0f, 0.0f, goodSize.width, svReader.frame.size.height)];
	} else {
		[svReader setContentSize:CGSizeMake(goodSize.width, goodSize.height)];
		[webView setFrame:CGRectMake(0.0f, 0.0f, goodSize.width, goodSize.height)];
	}
}

- (void)loadHTML:(NSString *)fileName{
	NSString *pdfPath2 = [[NSBundle mainBundle] pathForResource:fileName ofType:@"htm"];
	NSURL *pdfURL = [NSURL fileURLWithPath:pdfPath2];
	NSURLRequest *URLReq = [NSURLRequest requestWithURL:pdfURL];
	wvReader.alpha = 0.0f;
	[wvReader loadRequest:URLReq];
	wvReader.alpha = 1.0f;
}
		
- (void)didReceiveMemoryWarning {
    // Releases the view if it doesn't have a superview.
    [super didReceiveMemoryWarning];
    
    // Release any cached data, images, etc that aren't in use.
}

- (void)viewDidUnload {
    [super viewDidUnload];
    if (timer) {
        [timer invalidate];
        timer = nil;
    }
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}


- (void)dealloc {

    [super dealloc];
}

- (void) viewWillAppear:(BOOL)animated {
	CGFloat shaderHeight = 60.0f;
    CGFloat bHeight = 45.0f;
    CGFloat bWidth = self.view.frame.size.width * 0.75;
    [self.bClose setFrame:CGRectMake((self.view.frame.size.width - bWidth) * 0.5, self.view.frame.size.height - bHeight, bWidth, bHeight)];
//	[self.view setFrame:frame];
	[wvReader setFrame:CGRectMake(1.0f, 1.0f, self.view.frame.size.width - 2.0f, self.view.frame.size.height - 2.0f)];
	[wvReader reload];
	[ivTopFader setFrame:CGRectMake(0.0f, 0.0f, self.view.frame.size.width, shaderHeight)];
	[ivBottomFader setFrame:CGRectMake(0.0f, self.view.frame.size.height - shaderHeight, self.view.frame.size.width, shaderHeight)];
    
	[svReader setFrame:CGRectMake(self.view.frame.origin.x, self.view.frame.origin.y, self.view.frame.size.width, self.view.frame.size.height)];
	if (timer != nil) {
		[timer invalidate];
		[self startScrolling];
	}
    
}

#pragma mark -
#pragma mark Controller Animation Cycle
- (void)animationHasFinished:(NSString *)animationID finished:(BOOL)finished context:(void *)context {
	if (animationID == @"fadeOutReader"/* && finished*/) {
        if(self.parentViewController)
            [self.parentViewController dismissModalViewControllerAnimated:YES];
        else
            [self.presentingViewController dismissModalViewControllerAnimated:YES];
	}
	if (animationID == @"fadeInReader"/* && finished*/) {  
		[self startScrolling];
	}
}	

- (void)fadeOutReader {		//Animate Fade Out
	[UIView beginAnimations:@"fadeOutReader" context:nil];
	[UIView setAnimationDuration:0.25f];
    [UIView setAnimationDelegate:self];
	[UIView setAnimationDidStopSelector:@selector(animationHasFinished:finished:context:)];
	self.view.alpha = 0.0f;
	[UIView commitAnimations];
}

- (void)fadeInReader {		//Animate Fade Out
	[UIView beginAnimations:@"fadeInReader" context:nil];
	[UIView setAnimationDuration:1.0f];
    [UIView setAnimationDelegate:self];
	[UIView setAnimationDidStopSelector:@selector(animationHasFinished:finished:context:)];
	self.view.alpha = 1.0f;
	[UIView commitAnimations];
}

- (void)animShowView {		//Animate Fade Out
	//CGRect r = self.view.frame;
	//[UIView beginAnimations:@"animShowView" context:nil];
	//[UIView setAnimationDuration:1.0f];
	//[UIView setAnimationDelegate:self];
	//[UIView setAnimationDidStopSelector:@selector(animationHasFinished:finished:context:)];

	//[UIView commitAnimations];
}

- (void)startScrolling{
	scrollCounter = 0;
	bScroll = NO;
	timer =	[NSTimer scheduledTimerWithTimeInterval:animationInterval
											 target:self
										   selector:@selector(scroll:)
										   userInfo:nil
											repeats:YES];
	
}

-(void)scroll:(NSTimer *)theTimer {
	scrollCounter++;
	CGPoint old = [svReader contentOffset];
	if ((CGFloat)scrollCounter * animationInterval > 5.0f) {  //However many seconds to wait before scrolling.
		bScroll = YES;
	}
	if (!bScroll) return;
	if (old.y + svReader.frame.size.height >= svReader.contentSize.height) {
        if (!self.bClose.enabled) {
            [self.bClose setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
            self.bClose.enabled = YES;
            self.bClose.alpha = 1.0f;
        }
        if (old.y + svReader.frame.size.height >= svReader.contentSize.height + svReader.contentInset.bottom) {
            return;
        }
	}
	[svReader setContentOffset:CGPointMake(0.0f, old.y + pixelsPerFrame) animated:NO];
}

- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
	CGPoint old = [svReader contentOffset];
    if (!self.bClose.enabled && old.y + scrollView.frame.size.height >= scrollView.contentSize.height - scrollView.contentInset.bottom) {
        [self.bClose setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        UIImage *img = [UIImage imageNamed:@"border2.png"];
        UIImage *newImg = [img stretchableImageWithLeftCapWidth:img.size.width/2 topCapHeight:img.size.height/2];
        [self.bClose setBackgroundImage:newImg forState:UIControlStateNormal];
        self.bClose.enabled = YES;
        self.bClose.alpha = 1.0f;
    }
    
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
	scrollCounter = 0;
	if (bScroll) {
		bScroll = NO;
	}
}
- (void)bClose_Click:(id)sender {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setBool:true forKey:@"agreeEULA"];

    [self fadeOutReader];
}
@end
