// Shared approved dialogue copy also supplies the typography fitting corpus.
import {WIZARD_SPELL_POSES} from './wizard-spell-poses.js?v=5847e2b65376';
export const OGRE_OPENING=[
 [9,"Greetings friend! Don't see many heroes these days. If your quest leads you to the Nameless Dragon, you've come to the right place!"],
 [8,"The Dragon won't give up his name easily. He's sure to challenge you to combat. Lucky for you, I'm an expert on attacking!"],
 [11,"Attacking is about two things: timing and accuracy. You gotta be fast but you also gotta hit him where it counts. I can show you how."],
 [9,"Look at the window below. You're gonna try to stop the moving bar right as it passes over the target. Hit it right in the middle for a bonus strike."],
 [12,"Too early or too late? That dragon is gonna burn you up for sure. Also, don't hesitate too long. Dragons don't wait around forever for you to attack."],
 [4,"Got the idea? Let's practice and see if you have what it takes. I'll go easy on you at first. Ready?"]
];
export const ELF_OPENING=[
 [1,"Welcome traveler! You must have traveled long to reach this far into the dungeon. You must be seeking the Nameless One."],
 [9,"He is a terrifying foe and has defeated many a brave soul. He's sure to attack you from all sides. Fortunately, we elves are experts in defense."],
 [13,"Defense is all about awareness and reflexes. Stay on the move and expect attacks from anywhere. I will teach you our ways."],
 [7,"Look at the window below. You are in the middle and will have to block incoming projectiles with your shield. Move your shield left and right to defend yourself."],
 [8,"Too slow or too fast? The dragon's fire will burn you. You can only take so many hits before you will succumb to his power."],
 [4,"Do you see? Let us practice and hone your skills. We will begin slowly. Ready?"]
];
export const WIZARD_OPENING=[
 [5,"Salutations! You must be keen of mind to have traversed this far. I presume you seek the beast who has no name?"],
 [4,"Hmmmm. He is cunning, that one. Many a worthy adversary has bowed to his intellect. By chance, we wizards are masters of the mind."],
 [7,"Intelligence is about two things: focus and concentration. What seems simple soon turns to complex. You must remain vigilant! I can show you how."],
 [WIZARD_SPELL_POSES.blue[2],"Observe this spell and notice its particular color. It is meant to cloud your mind, but if you can shout out its hue, it will be countered and the spell will be broken."],
 [WIZARD_SPELL_POSES.blue[1],"Seems simple, eh? Well, be sure that the dragon will try to fool you. Also, his spells are strong and you will only have a small window to counter them."],
 [6,"Understand? We shall practice and see if your mind can remain clear. We will start simply and then build. Ready?"]
];
export const DRAGON_OPENING=[
  [12,"WHO DARES ENTER MY CHAMBER?!?!"],
  [11,"Another so-called challenger come to discover my true name? Know that you are one of many. All before you have fallen short."],
  [7,"Perhaps you will be the one who finally is able to overcome my greatness. It will not be easy. Those pathetic guardians think they might have prepared you."],
  [6,"Their skills are nothing compared to mine. You will need to take all you have practiced and put it to the test. Here you face consequences."],
  [4,"You will need to attack, defend and think quickly. Every mistake will cost you. I'll track your progress on this gauge."],
  [6,"If this ever falls to empty, you will have shown your unworthiness, and I will expel you back into the maze."],
  [8,"However, I am fair. If you do well, you may find the level will rise. There is but one way to find out."],
  [10,"Let's begin and see if you are truly worthy to know my name!!!"]
];
export const DOOR_DESCRIPTIONS={
  ogre:'Its hinges are strong and its timber is aged but sturdy.',
  wizard:'Ancient runes shine from its surface in languages long forgotten.',
  queen:'Its frame seems to grow and twist from the ground itself.',
  dragon:'Its carvings are made of glowing metals you’ve never seen before.'
};
export const GUARDIAN_WARNING='You must find all the guardians before entering this chamber. You are NOT prepared.';
export const MAZE_INTRO='You stand at the southeast entrance. Seek the three guardians, then confront the dragon. Their locations appear on the map only after discovery.';
export const STORY_SAMPLES=[...OGRE_OPENING.map(([,text])=>text),...ELF_OPENING.map(([,text])=>text),...WIZARD_OPENING.map(([,text])=>text),...DRAGON_OPENING.map(([,text])=>text),MAZE_INTRO,GUARDIAN_WARNING,...["Great job! You've got what it takes for sure. He'll be a tougher opponent than me, but just remember what I taught you, and you'll be fine. Good luck!", "Well done! You are light of foot and strong of heart. The dragon will be swift with his attacks but you show true courage. Farewell!", "Huzzah! You are indeed keen of mind. The dragon will surely test your intellect further, but stay focused and you will prevail. Fare thee well!", "I never thought this day would come. You are worthy to know my true name. Proceed to accept your prize.", "You clearly have some skills, but I was just warming up. Let's see if you survive this next round.", "Finally, a competent challenger. Perhaps I've finally found someone worthy of my name. This last round will test your true measure!"]];
export const JOURNAL_SAMPLE="The Ogre’s advice: Be fast and accurate when you attack. The Elf Queen’s advice: Stay aware, keep moving, and react quickly to block incoming attacks. The Wizard’s advice: Stay focused and concentrate. Match the spell’s color to its written name, and ignore distractions. The dragon’s true name: CHAZ.";
