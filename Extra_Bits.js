G.AddData({
name:'Extra Bits',
author:'ETB',
desc:'Miscellaneous extra\'s, such as flavor Text.',
engineVersion:1,
requires:['Default dataset*'],
sheets:{'extraSheet':'img/sprites.png'},//custom stylesheet (note : broken in IE and Edge for the time being)
func:function()
{	
	new G.Res({
		name:'drunk',
		desc:'[adult,People] can get [drunk,Drunk] when when they consume too much [drink,Alcohol]. They do not [worker,work], but they don\'t [corpse,Die] either.//Mostly.//Can be cured by healers',
		partOf:'population',
		icon:[0,0], // TODO: drunk person sprite
	});
	
	
	new G.Res({
		name:'drink',
		desc:'[drink] is required to keep your [population,people] hydrated, at the rate of half a unit per person every 3 ticks (although babies and children drink less).//Without water, people will resort to drinking [muddy water], which is unhealthy; if that runs out too, your people will simply die off.//Most terrains have some fresh water up for gathering - from ponds, streams and rain; drier locations will have to rely on well digging.//Water turns into [muddy water] over time, if your water storage is insufficient.',
		icon:[0,0,'drinkSheet'],
		turnToByContext:{
			'drinking':{'health':0.01,'happiness':0.3},
			'decay':{'drink':0.95,'spoiled food':0.05},
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
			'decay':{'drink':0.95,'spoiled food':0.05},
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
			'decay':{'drink':0.95,'spoiled food':0.05},
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
			'decay':{'drink':0.95,'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});
	new G.Res({
		name:'seed',
		desc:'.',
		icon:[0,0], // TODO: seed sprite
		turnToByContext:{
			'drinking':{'health':0.01,'happiness':0.01},
			'decay':{'drink':0.95,'spoiled food':0.05},
			},
		partOf:'food',
		category:'food',
	});
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
	/*
	//Then we augment the base data to incorporate our new resources :
		//adding honey as something that can be gathered from berry bushs(rarely) and most trees.
	G.getDict('berry bush').res['gather']['hive']=0.1;
	G.getDict('oak').res['gather']['hive']=1;
	G.getDict('birch').res['gather']['hive']=0.5;
	G.getDict('acacia').res['gather']['hive']=0.5;
	G.getDict('fir tree').res['gather']['hive']=0.5;
	G.getDict('dead tree').res['gather']['hive']=0.3;
	*/
	
		//adding ability for hives to be found in select lands
		//since 'goods' is a array with dicts in it, we use the push function
		/*
	G.dict['jungle']
	G.dict['forest']
	G.dict['boreal forest']
	G.dict['shrubland']
	G.dict['prairie']
	G.dict['savanna']
	G.dict['tundra']
		*/
		
	G.getDict('jungle').goods.push({type:'hive',amount:3});
	G.getDict('forest').goods.push({type:'hive',amount:3});
	G.getDict('boreal forest').goods.push({type:'hive',amount:1.5});
	G.getDict('shrubland').goods.push({type:'hive',chance:0.4,min:0.3,max:0.6});
	G.getDict('prairie').goods.push({type:'hive',chance:0.2,min:0.1,max:0.3});
	G.getDict('savanna').goods.push({type:'hive',chance:0.3,min:0.1,max:0.3});
	G.getDict('tundra').goods.push({type:'hive',chance:0.08,min:0.1,max:0.3});
		
		//adding new modes to artisans so they can make drink from fruit, herb, or honey
		//modes are just dicts within dicts so this works.
	G.getDict('artisan').modes['beer']={name:'Make alcohol from herb',desc:'Turn 5 [herb]s & 1 [water] into 1 [drink].',req:{'fermentation':true,},use:{'stone tools':1}};
	G.getDict('artisan').modes['wine']={name:'Make alcohol from fruit',desc:'Turn 5 [fruit]s & 1 [water] into 1 [drink].',req:{'fermentation':true,},use:{'stone tools':1}};
	G.getDict('artisan').modes['mead']={name:'Make alcohol from honey',desc:'Turn 5 [honey]s & 1 [water] into 1 [drink].',req:{'fermentation':true,},use:{'stone tools':1}};
		//adding a new effect to artisans that handles the actual hot sauce preparing and is only active when the unit has the mode "hot sauce"
		//since 'effects' and 'effectsOff' are arrays with dicts in it, we use the push function
	G.getDict('artisan').effects.push({type:'convert',from:{'fruit':5,},into:{'drink':1},every:3,mode:'wine'});
	G.getDict('artisan').effects.push({type:'convert',from:{'herb':5,},into:{'drink':1},every:3,mode:'beer'});
	G.getDict('artisan').effects.push({type:'convert',from:{'honey':5,},into:{'drink':1},every:3,mode:'mead'});
		//TODO: add tech to make brewing possible for artisans
	
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
		desc:'@[artisan]s can now create alcoholic [drink]s.',
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