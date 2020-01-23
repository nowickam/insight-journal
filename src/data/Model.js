import ObservableModel from "./ObservableModel";
import { BASE_URL, httpOptions, firebaseConfig, HEADER_KEY } from "./apiConfig";

class Model extends ObservableModel {
	constructor() {
		super();
		this.query = null;
		this.currentUser = null;

		global.firebase.initializeApp(firebaseConfig);
		this.db = global.firebase.firestore();
		this.allUsers = this.db.collection("users");
		this.today = new Date().toJSON().slice(0, 10).toString();
	}

	getId() {
		return this.currentUser;
	}

	getToday() {
		return this.today;
	}

	getUser(id) {
		return this.allUsers.doc(id)
			.get()
			.then(user => { if (user.exists) return user.data(); })
			.catch(e => console.log(e));
	}


	userExists(id, password) {
		return this.allUsers.doc(id)
			.get()
			.then(user => { return user.exists; })
			.catch(e => console.log(e));
	}

	checkPassword(id, password) {
		let x = false;
		return this.allUsers.doc(id)
			.get()
			.then(user => {
				if (user.data().password === password){
					this.currentUser = id;
					x = true;
					this.notifyObservers({ type: "login", correct: x });
				}
				else {this.notifyObservers({ type: "login", correct: x });}
			})
	}

	addUser(id, password) {
		return this.userExists(id, password)
			.then(response => {
				if (response === false) {
					this.allUsers.doc(id).set({
						id: id,
						password: password
					});
					this.currentUser = id;
					this.notifyObservers({ type: "new-user", added: true });
				}
				else {
					this.notifyObservers({ type: "new-user", added: false });
				}

			})
			.catch((e) => console.log(e));
	}

	addEntry(userId, text) {
		modelInstance.userExists(userId)
			.then(res => {
				if (res === false)
					modelInstance.addUser(userId)
			})
			.catch(e => console.log(e));

		let entry = {
			"content": text,
			"contenttype": "text/plain",
			"created": Date.now(),
			"id": userId,
			"language": "en",
			"date": this.today
		}

		this.notifyObservers({ type: "new-entry" });

		return this.allUsers.doc(userId).collection("currentEntries").doc(entry.created.toString()).set(entry);
	}

	deleteEntry(userId, created) {
		this.notifyObservers({ type: "new-entry" });

		return this.allUsers.doc(userId).collection("currentEntries").doc(created.toString()).delete();
	}

	entryExists(userId,date){
		return this.allUsers.doc(userId).collection("cachedEntries").doc(date.toString())
		.get()
		.then(doc=>{return doc.exists})
		.catch(e=>console.log(e));
	}

	getCurrentEntries(userId) {
		let user = this.allUsers.doc(userId);
		return user.collection("currentEntries").orderBy("created")
			.get()
			.then(response => response.docs)
			.catch();
	}

	getDailyCachedEntries(userId, date) {
		let user = this.allUsers.doc(userId);
		return user.collection("cachedEntries").doc(date)
			.get()
			.then(response => {
				if (response.exists)
					return [date, response.data().content, response.data().profile]
				else
					return [date, null];
			})
			.catch(e => console.log(e));
	}

	getEntriesText(userId,del) {
		let user = this.allUsers.doc(userId);
		let text = "";
		return user.collection("currentEntries").orderBy("created")
			.get()
			.then(docs => {
				docs.forEach(doc => {
					text += doc.data().content + " ";

					if(del===true)doc.ref.delete();
				})
			})
			.then(() => { return text; })
			.catch(e => console.log(e));
	}

	checkEntriesLength(userId){
		return this.getEntriesText(userId,false)
		.then(text=>{
			if(text.length<100)
				return true;
			else
				return false;
		})
		.catch(e=>console.log(e));
	}

	cacheEntries(userId, date) {
		let text="";
		let user = this.allUsers.doc(userId);
		return this.getEntriesText(userId,true)
			.then(response => {
				text=response;
				user.collection("cachedEntries").doc(date).set(
					{
						"content": text,
						"contenttype": "text/plain",
						"created": Date.now(),
						"id": userId,
						"language": "en",
						"date": this.today
					}
				)
			})
			.then(() => {
				this.notifyObservers({ type: "cache-entries" });
				this.notifyObservers({ type: "new-entry" });
			})
			.then(() => { return text; })
			.catch(e => console.log(e));
	}

	convertToTime(timestamp) {
		let t = timestamp * 1000;
		let minutes = "0" + t.getMinutes();
		let date = t.getFullYear() + '-' + t.getMonth() + '-' + t.getDate() + ' ' + t.getHours() + ':' + minutes.substr(-2);
		return date;
	}

	prepQuery() {
		let currentQuery = { "contentItems": [this.query] };
		return JSON.stringify(currentQuery, ['contentItems', 'content', 'contenttype', 'created', 'id', 'language']);
	}

	checkTextLength(text) {
		if (text.length > 100)
			return true;
		return false;
	}

    getAllTextEntries(userId){
		let user = this.allUsers.doc(userId);
		let text = "";
		return user.collection("cachedEntries").orderBy("created")
			.get()
			.then(docs => {
				docs.forEach(doc => {
					text += doc.data().content + " ";
				})
			})
			.then(() => { return text; })
			.catch(e => console.log(e));
	}
	getOverview(txt) {
		//let user = this.currentUser;
		//let txt = modelInstance.getAllTextEntries("1");
		return modelInstance.fetchDailyProfile("1", txt);
	}
	getPersonalityType(type){
		if (type === "Openness")
			return "Openness is a general appreciation for art, emotion, adventure, unusual ideas, imagination, curiosity, and variety of experience. People who are open to experience are intellectually curious, open to emotion, sensitive to beauty and willing to try new things. They tend to be, when compared to closed people, more creative and more aware of their feelings. They are also more likely to hold unconventional beliefs. High openness can be perceived as unpredictability or lack of focus, and more likely to engage in risky behaviour or drug taking. Moreover, individuals with high openness are said to pursue self-actualization specifically by seeking out intense, euphoric experiences. Conversely, those with low openness seek to gain fulfillment through perseverance and are characterized as pragmatic and data-driven, sometimes even perceived to be dogmatic and closed-minded.";
		if (type === "Conscientiousness")
			return "Conscientiousness is a tendency to display self-discipline, act dutifully, and strive for achievement against measures or outside expectations. It is related to the way in which people control, regulate, and direct their impulses. High conscientiousness is often perceived as being stubborn and focused. Low conscientiousness is associated with flexibility and spontaneity, but can also appear as sloppiness and lack of reliability. High scores on conscientiousness indicate a preference for planned rather than spontaneous behavior. The average level of conscientiousness rises among young adults and then declines among older adults.";
		if (type === "Extraversion")
			return "Extraversion is characterized by breadth of activities (as opposed to depth), surgency from external activity/situations, and energy creation from external means. The trait is marked by pronounced engagement with the external world. Extraverts enjoy interacting with people, and are often perceived as full of energy. They tend to be enthusiastic, action-oriented individuals. They possess high group visibility, like to talk, and assert themselves. Extraverted people may appear more dominant in social settings, as opposed to introverted people in this setting.";
		if (type === "Agreeableness")
			return "The agreeableness trait reflects individual differences in general concern for social harmony. Agreeable individuals value getting along with others. They are generally considerate, kind, generous, trusting and trustworthy, helpful, and willing to compromise their interests with others. Agreeable people also have an optimistic view of human nature.";
		if (type === "Emotional range")
			return "Emotional range, or neuroticism, is the tendency to experience negative emotions, such as anger, anxiety, or depression. It is sometimes called emotional instability, or is reversed and referred to as emotional stability. According to Eysenck's (1967) theory of personality, neuroticism is interlinked with low tolerance for stress or aversive stimuli. Neuroticism is a classic temperament trait that has been studied in temperament research for decades. Those who score high in neuroticism are emotionally reactive and vulnerable to stress, also tending to be flippant in the way they express emotion. They are more likely to interpret ordinary situations as threatening, and minor frustrations as hopelessly difficult. Their negative emotional reactions tend to persist for unusually long periods of time, which means they are often in a bad mood. For instance, neuroticism is connected to a pessimistic approach toward work, confidence that work impedes personal relationships, and apparent anxiety linked with work. Furthermore, those who score high on neuroticism may display more skin-conductance reactivity than those who score low on neuroticism. These problems in emotional regulation can diminish the ability of a person scoring high on neuroticism to think clearly, make decisions, and cope effectively with stress. Moreover, individuals high in neuroticism tend to experience more negative life events, but neuroticism also changes in response to positive and negative life experiences. Also, individuals with higher levels of neuroticism tend to have worse psychological well being.";
		else
			return "Not a recognized type";
	}
	getPersonalityDescription(type){
		if (type === 0)
			return "Your tendency to be compassionate and cooperative toward others";
		if (type === 1)
			return "Your tendency to act in an organized or thoughtful way";
		if (type === 2)
			return "Your tendency to seek stimulation in the company of others";
		if (type === 3)
			return "The extent to which a your emotions are sensitive to your environment (also referred to as Neuroticism or Natural reactions)";
		if (type === 4)
			return "The extent to which a you are open to experiencing different activities";
		else
			return "Not a recognized type";
	}


	// API methods

	fetchDailyProfile(text) {
		this.query = text;

		if (this.checkTextLength(text)) {
			let contentItem = modelInstance.prepQuery();
			const url = `${BASE_URL}` + HEADER_KEY + `/v3/profile?version=2019-10-13`;
			Object.assign(httpOptions, { body: contentItem });
			return fetch(url, httpOptions).then(this.processResponse);
		}
		else
			return null;
	}

	processResponse(response) {
		if (response.ok) {
			return response.json();
		}
		throw response;
	}

	assignDailyProfile(userId, date, content) {
		let user = this.allUsers.doc(userId);
		user.collection("cachedEntries").doc(date.toString()).set({
			profile: content
		}, { merge: true });
	}
}

// Export an instance of DinnerModel
const modelInstance = new Model();
export default modelInstance;
