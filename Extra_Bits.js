G.AddData({
name:'Extra Bits',
author:'ETB',
desc:'Miscellaneous extra\'s, such as flavor Text.',
engineVersion:1,
requires:['Default dataset*'],
// sheets:{'extraSheet':'img/sprites.png'},//custom stylesheet (note : broken in IE and Edge for the time being)
func:function()
{

G.RuinTheFun; // for Debug purposes only. Comment/delete when commiting.

	/*=====================================================================================
	RESOURCES
	=======================================================================================*/
	
	// pushing new elements into current res catagories
	G.getRes('demog').base.push('drunk');
	// G.getRes('food').side.push('water storage');
	// G.getRes('food').side.push('archaic food resources','basic food resources','advanced food resources');

	/*
	new G.Res({
		name:'water storage',
		desc:'Each [water storage] unit slows down decay for one [water] unit.//The number on the left is how much water storage is occupied, while the number on the right is how much you have in total.',
		icon:[12,5],
		tick:function(me,tick)
		{
			var amount=0;
			amount+=G.getRes('basket').amount*10;
			amount+=G.getRes('pot').amount*25;
			amount+=G.getRes('ice').amount;
			amount+=G.getRes('added food storage').amount;
			me.amount=amount;
		},
		getDisplayAmount:function()
		{
			return B(Math.min(this.displayedAmount,G.getRes('food').displayedAmount))+'<wbr>/'+B(this.displayedAmount);
		},
	});

	new G.Res({
		name:'added water storage',
		//water storage added by buildings
		desc:'',
		icon:[12,5],
		hidden:true,
	});
	
	*/
	
	new G.Res({
		name:'drunk',
		desc:'[adult,People] can get [drunk] when when they consume too much [alcohol]. They do not [worker,work], but they don\'t [corpse,Die] either.//Mostly.//Can be cured by healers',
		partOf:'population',
		icon:[0,0], // TODO: drunk person sprite
		tick:function(me,tick)
		{
			// should work
			if (G.checkPolicy('disable aging')=='off')
			{
				var toChange=0.00003;
				if (G.getRes('alcohol').amount>0)
				{
					/*
					if (G.getRes('health').amount<0)
					{
						toChange*=(1+Math.abs(G.getRes('health').amount/me.amount));
					}
					*/
					if (toChange>0)
					{
						if (me.amount<=15) toChange*=0.5;
						var changed=0;
						var weights={'baby':0,'child':0,'adult':1,'elder':1};
						
						if (G.checkPolicy('flower rituals')=='on') toChange*=0.3;
						if (G.checkPolicy('fertility rituals')=='on') toChange*=0.3;
						if (G.checkPolicy('harvest rituals')=='on') toChange*=0.3;
						if (G.checkPolicy('wisdom rituals')=='on') toChange*=0.3;
						if (G.checkPolicy('population control')!=='normal') toChange*=0.3;
						if (G.checkPolicy('elder workforce')=='on') weights['elder']*=2;
						
						for (var i in weights)
						{var n=G.lose(i,randomFloor(Math.random()*G.getRes(i).amount*toChange*weights[i]),'-');changed+=n;}
						G.gain('drunk',changed,'-');
						if (changed>0) G.Message({type:'bad',mergeId:'fellDrunk',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' got drunk.';},args:{n:changed},icon:[0,0]});
					}
				}
				
					var drunkHealing=0.01;
					if (G.checkPolicy('flower rituals')=='on') drunkHealing*=1.2;
					var changed=0;
					var n=G.lose('drunk',randomFloor(Math.random()*G.getRes('drunk').amount*drunkHealing),'healing');G.gain('adult',n,'-');changed+=n;
					G.gain('happiness',changed*10,'recovery');
					if (changed>0) G.Message({type:'good',mergeId:'drunkRecovered',textFunc:function(args){return B(args.n)+' drunk '+(args.n==1?'person':'people')+' got sober.';},args:{n:changed},icon:[4,3]});

					var drunkMortality=0.0005;
					var changed=0;
					var n=G.lose('drunk',randomFloor(Math.random()*G.getRes('sick').amount*drunkMortality),'-');G.gain('corpse',n,'disease');changed+=n;
					G.gain('happiness',-changed*15*deathUnhappinessMult,'death');
					G.getRes('died this year').amount+=changed;
					if (changed>0) G.Message({type:'bad',mergeId:'diedDrunk',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' died from alcohol poisoning.';},args:{n:changed},icon:[5,4]});
			}
		}
	});
	
	
	new G.Res({
		name:'alcohol',
		desc:'A beverage made from the fermentation of certain [food].//Contains beer, wine, and mead.',
		icon:[0,0], // TODO: Sprite
		turnToByContext:{
			'drinking':{'health':0.01,'happiness':0.06},
			'decay':{'muddy water':0.05,'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});
	
	new G.Res({
		name:'honey',
		desc:'A sweet, sticky substance that comes from some [bugs,insects].',
		icon:[0,0], // TODO: honey sprite
		turnToByContext:{
			'eating':{'health':0.03,'happiness':0.03},
			'decay':{'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});
	
	new G.Res({
		name:'vegetable',
		desc:'TODO',
		icon:[0,0], // TODO: vegetable sprite
		turnToByContext:{
			'eating':{'health':0.03,'happiness':0.01},
			'decay':{'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});
	
	new G.Res({
		name:'grain',
		desc:'TODO',
		icon:[0,0], // TODO: grain sprite
		turnToByContext:{
			'eat':{'health':0.01,'happiness':0.01},
			'decay':{'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});

/*
	new G.Res({
		name:'archaic food resources',
		desc:'.',
		icon:[0,0],
		turnToByContext:{
			'eating':{'health':0.03,'happiness':0.01},
			'decay':{'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});

	new G.Res({
		name:'basic food resources',
		desc:'.',
		icon:[0,0],
		turnToByContext:{
			'eating':{'health':0.03,'happiness':0.01},
			'decay':{'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});

	new G.Res({
		name:'luxury food resources',
		desc:'.',
		icon:[0,0],
		turnToByContext:{
			'eating':{'health':0.03,'happiness':0.01},
			'decay':{'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});

*/

	new G.Goods({
		name:'hive',
		desc:'[hive,Insect Hives] can be foraged for [honey] and [bugs,insects]s.',
		icon:[0,0], // TODO: hive sprite
		res:{
			'gather':{'honey':3,'bugs':0.5},
		},
		affectedBy:['scarce forageables','deforestation'],
		mult:10,
	});
	
	new G.Goods({
		name:'wild wheat',
		desc:'[hive,Insect Hives] can be foraged for [honey] and [bugs,insects]s.',
		icon:[0,0], // TODO: hive sprite
		res:{
			'gather':{'grain':3},
		},
		affectedBy:['scarce forageables'],
		mult:10,
	});

	new G.Goods({
		name:'vegetable bushes',
		desc:'[hive,Insect Hives] can be foraged for [honey] and [bugs,insects]s.',
		icon:[0,0], // TODO: hive sprite
		res:{
			'gather':{'vegetable':3},
		},
		affectedBy:['scarce forageables'],
		mult:10,
	});

	new G.Goods({
		name:'seaweed',
		desc:'[hive,Insect Hives] can be foraged for [honey] and [bugs,insects]s.',
		icon:[0,0], // TODO: hive sprite
		res:{
			'gather':{'vegetable':3},
		},
		affectedBy:['scarce forageables'],
		mult:10,
	});

	G.getDict('grass').res['gather']['vegetable']=1;
	G.getDict('grass').res['gather']['grain']=1;
	
	G.getDict('jungle').goods.push({type:'hive',amount:3});
	G.getDict('forest').goods.push({type:'hive',amount:3});
	G.getDict('boreal forest').goods.push({type:'hive',amount:1.5});
	G.getDict('shrubland').goods.push({type:'hive',chance:0.4,min:0.3,max:0.6});
	G.getDict('prairie').goods.push({type:'hive',chance:0.2,min:0.1,max:0.3});
	G.getDict('savanna').goods.push({type:'hive',chance:0.3,min:0.1,max:0.3});
	G.getDict('tundra').goods.push({type:'hive',chance:0.08,min:0.1,max:0.3});
		
		//adding new modes to artisans so they can make alcohol from fruit, herb, or honey
		//modes are just dicts within dicts so this works.
	G.getDict('artisan').modes['beer']={name:'Make alcohol from herb',desc:'Turn 5 [herb]s & 1 [water] into 1 [alcohol].',req:{'fermentation':true,},use:{'stone tools':1}};
	G.getDict('artisan').modes['wine']={name:'Make alcohol from fruit',desc:'Turn 5 [fruit]s & 1 [water] into 1 [alcohol].',req:{'fermentation':true,},use:{'stone tools':1}};
	G.getDict('artisan').modes['mead']={name:'Make alcohol from honey',desc:'Turn 5 [honey]s & 1 [water] into 1 [alcohol].',req:{'fermentation':true,},use:{'stone tools':1}};
		//adding a new effect to artisans that handles the actual hot sauce preparing and is only active when the unit has the mode "hot sauce"
		//since 'effects' and 'effectsOff' are arrays with dicts in it, we use the push function
	G.getDict('artisan').effects.push({type:'convert',from:{'fruit':5,},into:{'alcohol':1},every:3,mode:'wine'});
	G.getDict('artisan').effects.push({type:'convert',from:{'herb':5,},into:{'alcohol':1},every:3,mode:'beer'});
	G.getDict('artisan').effects.push({type:'convert',from:{'honey':5,},into:{'alcohol':1},every:3,mode:'mead'});
	
	/*=====================================================================================
	PROPS
	=======================================================================================*/
	
	var extraLines=[//Add new day lines here comments
		'Waves calmly crash on forgotten shores.',
		'The day is scorching.',
		'Moisture sticks to the skin.',
		'Unknown creatures stir in the sea.',
		'Nothing of note...',
		'A freak snowstorm looms ominously.',
		'Odd insects break the silence of the night.',
		'A sunshower proves refreshing.',
		'Waves push an unknown object onto the shore.',
	];
	
	var mergedLines = G.props['new day lines'].concat(extraLines);
	G.props['new day lines'] = mergedLines;
	shuffle(G.props['new day lines']);
	
	/*=====================================================================================
	FUNCTIONS
	=======================================================================================*/
	
	/* For the future.
	
	G.funcs['new game blurb']=function() // Part of the NEW GAME launch box at the very begining of the game
	{
		var str=
		'<b>Your tribe :</b><div class="thingBox">'+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('adult'))+'"></div><div class="freelabel">x5</div>','5 Adults')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('elder'))+'"></div><div class="freelabel">x1</div>','1 Elder')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('child'))+'"></div><div class="freelabel">x2</div>','2 Children')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('herb'))+'"></div><div class="freelabel">x250</div>','250 Herbs')+
		G.textWithTooltip('<div class="icon freestanding" style="'+G.getIconUsedBy(G.getRes('water'))+'"></div><div class="freelabel">x250</div>','250 Water')+
		'</div>'+
		'<div class="par fancyText bitBiggerText">Your tribe finds a place to settle in the wilderness.<br>Resources are scarce, and everyone starts foraging.</div>'+
		'<div class="par fancyText bitBiggerText">You emerge as the tribe\'s leader. They call you :</div>';
		return str;
	}

	G.funcs['new game']=function() // Message you get when you start a new game
	{
		var str='Your name is '+G.getName('ruler')+''+(G.getName('ruler').toLowerCase()=='orteil'?' <i>(but that\'s not you, is it?)</i>':'')+', ruler of '+G.getName('civ')+'. Your tribe is primitive, but full of hope.<br>The first year of your legacy has begun. May it stand the test of time.';
		G.Message({type:'important tall',text:str,icon:[0,3]});
	}

	*/
	
	
	/*=====================================================================================
	POLICIES
	=======================================================================================*/
	new G.Policy({
		name:'eat herbs',
		desc:'Your people will eat or not eat [herb]s.<br>Your people <i>could start to starve</i>.',
		icon:[6,12,4,6],
		cost:{'influence':1},
		startMode:'on',
		req:{'rules of food':true},
		effects:[
			{type:'make part of',what:['herb'],parent:'food'},
		],
		effectsOff:[
			{type:'make part of',what:['herb'],parent:''},
		],
		category:'food',
	});
	
	new G.Policy({ // Incomplete
		name:'alcohol control',
		desc:'Set rules on how much your people are allowed to drink.',
		icon:[0,0,4,6],
		cost:{'influence':3},
		startMode:'normal',
		req:{'rules of food':true,'fermentation':true},
		modes:{
			'forbidden':{name:'Forbidden',desc:'Your people are under prohibition.//You population will get angry.'},
			'limited':{name:'Limited',desc:'Your people are allowed minimal drink.//Your population will get less drunk but also less happiness.'},
			'sufficient':{name:'Sufficient',desc:'Your people drink till satisfied.'},
			'plentiful':{name:'Plentiful',desc:'Your people drink without restriction.'},
		},
		effects:[ 
		//add effects for different modes
		],
		category:'food',
	});

	/*=====================================================================================
	TECH & TRAIT
	=======================================================================================*/

	new G.Tech({
		name:'fermentation',
		desc:'@[artisan]s can now create alcoholic [alcohol]s.',
		icon:[0,0],
		cost:{'insight':10},
		req:{'plant lore':true},
		effects:[
		],
		chance:3,
	});

		new G.Tech({
		name:'animal lore',
		desc:'@[hunters]s & [fishers]s catch more game, leading to more [meat] and [seafood]<>The knowledge of how animals live and behave means more effective hunting.',
		icon:[0,0],
		cost:{'insight':5},
		req:{'oral tradition':true},
		effects:[
		],
	});

}
});

	/*=====================================================================================
	WONDERS & ACHIEVEMENTS
	=======================================================================================*/
	
	// Tougher Mausoleum Achiev
	
/*

	var MauCost = G.getCostString('mausoleum')
	
*/