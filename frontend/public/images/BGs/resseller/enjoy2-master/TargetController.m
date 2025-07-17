//
//  TargetController.m
//  Enjoy
//
//  Created by Sam McCall on 5/05/09.
//

@implementation TargetController

-(void) keyChanged {
	[radioButtons setState: 1 atRow: 1 column: 0 ];
	[self commit];
}
-(IBAction)radioChanged:(id)sender {
	[[[NSApplication sharedApplication] mainWindow] makeFirstResponder: sender];
	[self commit];
}
-(IBAction)mdirChanged:(id)sender {
    [radioButtons setState: 1 atRow: 3 column: 0];
	[[[NSApplication sharedApplication] mainWindow] makeFirstResponder: sender];
	[self commit];
}
-(IBAction)mbtnChanged:(id)sender {
    [radioButtons setState: 1 atRow: 4 column: 0];
	[[[NSApplication sharedApplication] mainWindow] makeFirstResponder: sender];
	[self commit];
}
-(IBAction)sdirChanged:(id)sender {
    [radioButtons setState: 1 atRow: 5 column: 0];
	[[[NSApplication sharedApplication] mainWindow] makeFirstResponder: sender];
	[self commit];
}


-(Target*) state {
	switch([radioButtons selectedRow]) {
		case 0: // none
			return NULL;
		case 1: // key
			if([keyInput hasKey]) {
				TargetKeyboard* k = [[TargetKeyboard alloc] init];
				[k setVk: [keyInput vk]];
				[k setDescr: [keyInput descr]];
				return k;
			}
			break;
		case 2:
		{
			TargetConfig* c = [[TargetConfig alloc] init];
			[c setConfig: [[configsController configs] objectAtIndex: [configPopup indexOfSelectedItem]]];
			return c;
		}
        case 3: {
            // mouse X/Y
            TargetMouseMove *mm = [[TargetMouseMove alloc] init];
            [mm setDir: [mouseDirSelect selectedSegment]];
            return mm;
        }
        case 4: {
            // mouse button
            TargetMouseBtn *mb = [[TargetMouseBtn alloc] init];
            if ([mouseBtnSelect selectedSegment] == 0) {
                [mb setWhich: kCGMouseButtonLeft];
            }
            else {
                [mb setWhich: kCGMouseButtonRight];
            }
            return mb;
        }
        case 5: {
            // scroll
            TargetMouseScroll *ms = [[TargetMouseScroll alloc] init];
            if ([scrollDirSelect selectedSegment] == 0) {
                [ms setHowMuch: -1];
            }
            else {
                [ms setHowMuch: 1];
            }
            return ms;
        }
        case 6: {
            // toggle mouse scope
            TargetToggleMouseScope *tms = [[TargetToggleMouseScope alloc] init];
            return tms;
        }
	}
	return NULL;
}

-(void)configChosen:(id)sender {
	[radioButtons setState: 1 atRow: 2 column: 0];
	[self commit];
}

-(void) commit {
	id action = [joystickController selectedAction];
	if(action) {
		Target* target = [self state];
		[[configsController currentConfig] setTarget: target forAction: action];
	}
}

-(void) reset {
	[keyInput clear];
	[radioButtons setState: 1 atRow: 0 column: 0];
    [mouseDirSelect setSelectedSegment: 0];
    [mouseBtnSelect setSelectedSegment: 0];
    [scrollDirSelect setSelectedSegment: 0];
	[self refreshConfigsPreservingSelection: NO];
}

-(void) setEnabled: (BOOL) enabled {
	[radioButtons setEnabled: enabled];
	[keyInput setEnabled: enabled];
	[configPopup setEnabled: enabled];
    [mouseDirSelect setEnabled: enabled];
    [mouseBtnSelect setEnabled: enabled];
    [scrollDirSelect setEnabled: enabled];
}
-(BOOL) enabled {
	return [radioButtons isEnabled];
}

-(void) load {
	id jsaction = [joystickController selectedAction];
	currentJsaction = jsaction;
	if(!jsaction) {
		[self setEnabled: NO];
		[title setStringValue: @""];
		return;
	} else {
		[self setEnabled: YES];
	}
	Target* target = [[configsController currentConfig] getTargetForAction: jsaction];
	
	id act = jsaction;
	NSString* actFullName = [act name];
	while([act base]) {
		act = [act base];
		actFullName = [[NSString alloc] initWithFormat: @"%@ > %@", [act name], actFullName];
	}
	[title setStringValue: [[NSString alloc] initWithFormat: @"%@ > %@", [[configsController currentConfig] name], actFullName]];
	
	if(!target) {
		// already reset
	} else if([target isKindOfClass: [TargetKeyboard class]]) {
		[radioButtons setState:1 atRow: 1 column: 0];
		[keyInput setVk: [(TargetKeyboard*)target vk]];
	} else if([target isKindOfClass: [TargetConfig class]]) {
		[radioButtons setState:1 atRow: 2 column: 0];
		[configPopup selectItemAtIndex: [[configsController configs] indexOfObject: [(TargetConfig*)target config]]];
    }
    else if ([target isKindOfClass: [TargetMouseMove class]]) {
        [radioButtons setState:1 atRow: 3 column: 0];
        [mouseDirSelect setSelectedSegment: [(TargetMouseMove *)target dir]];
	}
    else if ([target isKindOfClass: [TargetMouseBtn class]]) {
        [radioButtons setState: 1 atRow: 4 column: 0];
        if ([(TargetMouseBtn *)target which] == kCGMouseButtonLeft)
            [mouseBtnSelect setSelectedSegment: 0];
        else
            [mouseBtnSelect setSelectedSegment: 1];
    }
    else if ([target isKindOfClass: [TargetMouseScroll class]]) {
        [radioButtons setState: 1 atRow: 5 column: 0];
        if ([(TargetMouseScroll *)target howMuch] < 0)
            [scrollDirSelect setSelectedSegment: 0];
        else
            [scrollDirSelect setSelectedSegment: 1];
    }
    else if ([target isKindOfClass: [TargetToggleMouseScope class]]) {
        [radioButtons setState: 1 atRow: 6 column: 0];
    } else {
		[NSException raise:@"Unknown target subclass" format:@"Unknown target subclass"];
	}
}

-(void) focusKey {
	[[[NSApplication sharedApplication] mainWindow] makeFirstResponder: keyInput];
}

-(void) refreshConfigsPreservingSelection: (BOOL) preserve  {
	int initialIndex = [configPopup indexOfSelectedItem];
	
	NSArray* configs = [configsController configs];
	[configPopup removeAllItems];
	for(int i=0; i<[configs count]; i++) {
		[configPopup addItemWithTitle: [[configs objectAtIndex:i]name]];
	}
	if(preserve)
		[configPopup selectItemAtIndex:initialIndex];
		
}

@end
