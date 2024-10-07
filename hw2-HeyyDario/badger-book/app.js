fetch('https://cs571.org/api/s24/hw2/students', {
	headers:{
		"X-CS571-ID": CS571.getBadgerId()
	}
})
	.then((res) => res.json())
	.then((data) => {
		console.log(data);
		document.getElementById("num-results").innerText = data.length;

		data.forEach(student => {
			const container = document.getElementById("students");
			const studentDiv = document.createElement("div");

			// new added Bootstrap's dynamic grid
			studentDiv.className = "col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3";

			const name = document.createElement("h2");
			name.textContent = student.name["first"] + " " + student.name["last"];
			studentDiv.appendChild(name);
			// Majors
			const major = document.createElement('p');
			major.textContent = "Major: " + student["major"];
			studentDiv.appendChild(major);
	  
			// Number of credits
			const credits = document.createElement('p');
			credits.textContent = student.name["first"] + " is taking " + student["numCredits"] + " credits this semester.";
			studentDiv.appendChild(credits);
	  
			// From WI or not
			const fromWI = document.createElement('p');
			const verb = student["fromWisconsin"] ? " is" : " is not"
			const interestPrompt = student.interests.length > 1 ? " interests " : " interest ";
			const ending = student.interests.length === 0 ? ". They'd prefer to keep it secret." : "including ...";
			fromWI.textContent = student.name["first"] + verb + " from Wisconsin" + " and has " + student.interests.length + interestPrompt + ending; // ? 'Yes' : 'No'
			studentDiv.appendChild(fromWI);
	  
			// Interests as an unordered list
			const interestsList = document.createElement('ul');
			student.interests.forEach(interest => {
			  const item = document.createElement('li');
			  item.textContent = interest;
			  /*
				Got the idea from Hongtao Hao, reveiced the snippet from https://stackoverflow.com/questions/4772774/how-do-i-create-a-link-using-javascript 
				and modified by me (Chengtao Dai).
			  */
			  var a = document.createElement('a');
			  // var linkText = document.createTextNode(interest);
			  a.appendChild(item);
			//   a.title = "my title text";
			//   a.href = "http://example.com";
			  interestsList.appendChild(a);
			  //interestsList.appendChild(item);
			  item.addEventListener("click", (e) => {
				const selectedText = e.target.innerText;
				// TODO update the search terms to search just for the
				//      selected interest, and re-run the search!
				const interestInput = document.getElementById("search-interest");
				interestInput.value = selectedText;
				handleSearch(e);
			})
			});
			studentDiv.appendChild(interestsList);
			container.appendChild(studentDiv);
		})

	})
	.catch(err => {
		console.error("Could not fetch student data: ", err);
	});


function buildStudents(studs) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.

	if (!studs){
		fetch('https://cs571.org/api/s24/hw2/students', {
		headers:{
			"X-CS571-ID": CS571.getBadgerId()
		}
		})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			document.getElementById("num-results").innerText = data.length;
			display(data);
		});
} else {
	display(studs)
	}
}

function display(students){
	const container = document.getElementById("students");
	container.innerHTML = '';

	students.forEach(student => {
	const studentDiv = document.createElement("div");

			// new added Bootstap's dynamic grid
			studentDiv.className = "col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3";

			const name = document.createElement("h2");
			name.textContent = student.name["first"] + " " + student.name["last"];
			studentDiv.appendChild(name);
			// Majors
			const major = document.createElement('p');
			major.textContent = "Major: " + student["major"];
			studentDiv.appendChild(major);
	  
			// Number of credits
			const credits = document.createElement('p');
			credits.textContent = student.name["first"] + " is taking " + student["numCredits"] + " credits this semester.";
			studentDiv.appendChild(credits);
	  
			// From WI or not
			const fromWI = document.createElement('p');
			const verb = student["fromWisconsin"] ? " is" : " is not"
			const interestPrompt = student.interests.length > 1 ? " interests " : " interest ";
			const ending = student.interests.length === 0 ? ". They'd prefer to keep it secret." : "including ...";
			fromWI.textContent = student.name["first"] + verb + " from Wisconsin" + " and has " + student.interests.length + interestPrompt + ending; // ? 'Yes' : 'No'
			studentDiv.appendChild(fromWI);
	  
			// Interests as an unordered list
			const interestsList = document.createElement('ul');
			student.interests.forEach(interest => {
			  const item = document.createElement('li');
			  item.textContent = interest;
			  var a = document.createElement('a');
			  // var linkText = document.createTextNode(interest);
			  a.appendChild(item);
			//   a.title = "my title text";
			//   a.href = "http://example.com";
			  interestsList.appendChild(a);
			  //interestsList.appendChild(item);
			  item.addEventListener("click", (e) => {
				const selectedText = e.target.innerText;
				// TODO update the search terms to search just for the
				//      selected interest, and re-run the search!
				const interestInput = document.getElementById("search-interest");
				interestInput.value = selectedText;
				handleSearch(e);
			})
			});
			studentDiv.appendChild(interestsList);
			container.appendChild(studentDiv);
	});
}



function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	// TODO Implement the search

	// search terms are case-insensitive, e.g. searching "cat" should yield results with "cAT"
	const nameInput = document.getElementById("search-name").value.trim().toLowerCase();
	const majorInput = document.getElementById("search-major").value.trim().toLowerCase();
	const interestsInput = document.getElementById("search-interest").value.trim().toLowerCase();
	// console.log(interestsInput);
	// console.log(nameInput);
	// console.log(majorInput);

	fetch('https://cs571.org/api/s24/hw2/students', {
	headers:{
		"X-CS571-ID": CS571.getBadgerId()
	}
})
	.then((res) => res.json())
	.then((data) => {
		const filteredStudts = data.filter(student => {
			const name = (student.name["first"] + " " + student.name["last"]).toLowerCase();
			const major = student["major"].toLowerCase();
			const interests = student.interests.map(interest => interest.toLowerCase());
			// used to debug
			//console.log(interests);
			//console.log(name);
			//console.log(major);

			return (!nameInput||name.includes(nameInput)) && (!majorInput || major.includes(majorInput)) && (!interestsInput || interests.some(interest => interest.includes(interestsInput)));
		})	
		// update the search result
		//console.log(filteredStudts); used to debug
		buildStudents(filteredStudts);

		// update num-results
		document.getElementById("num-results").innerText = filteredStudts.length;
	})
	
}

document.getElementById("search-btn").addEventListener("click", handleSearch);