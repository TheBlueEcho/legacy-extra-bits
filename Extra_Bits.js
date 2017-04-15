G.AddData({
name:'Extra Bits',
author:'ETB',
desc:'Miscellaneous extra\'s, such as flavor Text.',
engineVersion:1,
requires:['Default dataset*'],
sheets:{'extraSheet':'img/sprites.png'},//custom stylesheet (note : broken in IE and Edge for the time being)
func:function()
{

	/*=====================================================================================
	RESOURCES
	=======================================================================================*/
	
	new G.Res({
		name:'drunk',
		desc:'[adult,People] can get [drunk] when when they consume too much [alcohol]. They do not [worker,work], but they don\'t [corpse,Die] either.//Mostly.//Can be cured by healers',
		partOf:'population',
		icon:[0,0], // TODO: drunk person sprite
		tick:function(me,tick)
		{
			// Unfinished but should work
			if (G.checkPolicy('disable aging')=='off')
			{
				var toChange=0.00003;
				if (G.getRes('health').amount<0)
				{
					toChange*=(1+Math.abs(G.getRes('health').amount/me.amount));
				}
				if (toChange>0)
				{
					if (me.amount<=15) toChange*=0.5;
					if (G.checkPolicy('flower rituals')=='on') toChange*=0.6;
					if (G.checkPolicy('fertility rituals')=='on') toChange*=0.6;
					if (G.checkPolicy('harvest rituals')=='on') toChange*=0.6;
					if (G.checkPolicy('wisdom rituals')=='on') toChange*=0.6;
					if (G.checkPolicy('population control')!=='normal') toChange*=0.6;
					var changed=0;
					var weights={'baby':0,'child':0,'adult':1,'elder':1};
					// if (G.checkPolicy('child workforce')=='on') weights['child']*=2;
					if (G.checkPolicy('elder workforce')=='on') weights['elder']*=2;
					// if (G.year<5) weights['adult']=0;//adults don't fall sick the first 5 years
					for (var i in weights)
					{var n=G.lose(i,randomFloor(Math.random()*G.getRes(i).amount*toChange*weights[i]),'-');changed+=n;}
					G.gain('drunk',changed,'-');
					if (changed>0) G.Message({type:'bad',mergeId:'fellDrunk',textFunc:function(args){return B(args.n)+' '+(args.n==1?'person':'people')+' got drunk.';},args:{n:changed},icon:[0,0]});
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
			'drinking':{'health':0.01,'happiness':0.3},
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
			'drinking':{'health':0.03,'happiness':0.03},
			'decay':{'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'vegetable',
		desc:'.',
		icon:[0,0], // TODO: vegetable sprite
		turnToByContext:{
			'drinking':{'health':0.03,'happiness':0.01},
			'decay':{'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'grain',
		desc:'.',
		icon:[0,0], // TODO: grain sprite
		turnToByContext:{
			'drinking':{'health':0.01,'happiness':0.01},
			'decay':{'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});
	/*
	new G.Res({
		name:'seed',
		desc:'.',
		icon:[0,0], // TODO: seed sprite
		turnToByContext:{
			'drinking':{'health':0.01,'happiness':0.01},
			'decay':{'alcohol':0.95,'spoiled food':0.05},
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
	
	/*=====================================================================================
	FUNCTIONS
	=======================================================================================*/
	
	var mergedLines = G.props['new day lines'].concat(extraLines);
	G.props['new day lines'] = mergedLines;
	shuffle(G.props['new day lines']);
	
	/* For the future.
	
	G.funcs['new game blurb']=function()
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

	G.funcs['new game']=function()
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