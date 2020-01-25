let __loggedInUser = null;
window.onload = () => {

    if (document.readyState === "complete") {
        document.getElementById('phone-number').value = localStorage.getItem('cph');
    } else if (document.readyState === "loading") {

    }
    firebase.auth().onAuthStateChanged(async function (user) {
        __loggedInUser = user;
        if (user && (await isNewUser(user.uid))) {
            // console.log('inside auth:' + user.uid + " " + user.phoneNumber);
            await showRegModalAndRegister(user.uid, user.phoneNumber);
        } else if (user) {
            // console.log(user);
            document.querySelector('#start-over-btn').classList.remove('d-none');
            document.querySelector('#id_lgout').classList.remove('d-none');
            document.getElementById('login-div').classList.remove('d-flex');
            document.getElementById('login-div').classList.add('d-none');
            document.getElementById('select-loc').classList.remove('d-none');
        }
    });
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    recaptchaVerifier.render().then(function (widgetId) {
        window.recaptchaWidgetId = widgetId;
    });

    // codes for selection of catagories/options
    setCardOptions('Select Catagory', ["Education", "Software", "Programming", "Language", "Dance", "Art", "Cooking", "Music", "Others"], false);
    document.querySelector('#start-over-btn').addEventListener('click', () => {
        window.location.reload();
    });
};

function handleSubmit(e) {
    // console.log('e', e);
    sendCode();
}

let tempConfirmationResult = null;
let __commonQueryString = "Re";
let __selectedSubjects = [];

async function sendCode() {
    const phoneNumber = '+880' + document.getElementById('phone-number').value;
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(async function (confirmationResult) {
            // console.log('sms sent');
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            // console.log(confirmationResult);
            tempConfirmationResult = confirmationResult;
            document.getElementById('enter-code').classList.remove('d-none');
            document.getElementById('recaptcha-container').classList.add('d-none');

            //    maybe check for new user ?? and let him register first.. ??

        }).catch(function (error) {
            // Error; SMS not sent
            console.log(error);
        });
}

async function confirmCode() {
    let confirmationResult = tempConfirmationResult;
    let code = document.getElementById('v-code').value;
    confirmationResult.confirm(code).then(async function (result) {
        // User signed in successfully.
        const user = result.user;

        /*if (user != null && isNewUser(user.uid)) {
            await showRegModalAndRegister(user.uid, user.phoneNumber);
        }*/

        document.querySelector('#id_lgout').classList.remove('d-none');
        // ...
        // console.log('success!', user);
        document.getElementById('lins').classList.remove('d-none');
        document.getElementById('linf').classList.add('d-none');
        //hiding login box
        document.getElementById('login-div').classList.remove('d-flex');
        document.getElementById('login-div').classList.add('d-none');
        document.getElementById('select-loc').classList.remove('d-none');
        //document.getElementById('select-loc').classList.add('d-flex');
        //document.getElementById('select-loc').classList.add('justify-content-center');


    }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        // ...
        document.getElementById('linf').classList.remove('d-none');
        document.getElementById('lins').classList.add('d-none');
        document.getElementById('resend-div').classList.add('d-flex');
        document.getElementById('resend-div').classList.add('justify-content-center');
        document.getElementById('resend-div').classList.remove('d-none');
        console.log(error);
    });
}

// helper function for new user registration...

async function isNewUser(uid) {
    const miniUser = await db.collection("mini_users").doc(uid).get();
    return miniUser.data() == null;
}

async function showRegModalAndRegister(uid, phone) {
    // console.log('uid inside modal is:' + uid);
    const regHtml = `<div class="modal fade" id="regModalCenter" data-backdrop="static" data-keyboard="false" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Just A Minute.. Please Register First</h5>
<!--                <button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
<!--                    <span aria-hidden="true">&times;</span>-->
<!--                </button>-->
            </div>
            <div class="modal-body">
<!--            This is for reg. fields..-->
                <div class="d-flex align-items-center m-2">
                    <p class="align-items-center align-middle">Your Phone number is: ${phone}</p> <button type="button" id="changeRegPhoneNumBtn" class="btn btn-outline-primary ml-1">Change</button>
                </div>
                
                <form> 
                    <div class="form-group input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                        </div>
                        <input id="RfName" class="form-control" placeholder="First name" type="text">
                        <input id="RlName" class="form-control" placeholder="Last name" type="text">
                    </div>
                    <!-- form-group// -->
                    <div class="form-group input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-envelope"></i> </span>
                        </div>
                        <input id="Remail" class="form-control" placeholder="Email address" type="email">
                    </div>
                    <!-- form-group// -->
                    <div class="form-group input-group">
                        <div class="input-group-prepend">
                            <!-- <span class="input-group-text"> <i class="fa fa-phone"></i> </span> -->
                        </div>
                        <div class="input-group-prepend">
                            <span class="input-group-text">+880</span>
                        </div>
                        <!-- <select class="custom-select" style="max-width: 120px;">
                        <option selected="">+971</option>
                        <option value="1">+972</option>
                        <option value="2">+198</option>
                        <option value="3">+701</option>
                    </select> -->

                        <input id="Rphone" class="form-control" placeholder="Phone number" type="text">
                    </div>
                    <!-- form-group// -->
                    <div class="form-group input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"> <i class="fa fa-building"></i> </span>
                        </div>
                        <select id="acc-type" class="form-control">
                            <option>Student</option>
                        </select>
                    </div>
                    <!-- form-group end.// -->
                    <div id="recaptcha-container" class="mb-2 d-flex justify-content-center"></div>
                    <div class="form-group">
                        <button type="button" id="createAccountButtonId" class="btn btn-primary btn-block"> Create Account</button>
                    </div>
                    <!-- form-group// -->

                </form>
            </div>
        </div>
    </div>
</div>
</div>`;

    const div = document.createElement('div');
    div.innerHTML = regHtml;
    document.getElementsByTagName('body')[0].appendChild(div);

    document.getElementById('changeRegPhoneNumBtn').onclick = async function () {
        signOut();
    };

    if (phone) {
        document.querySelector('#Rphone').value = phone.substr(4);
        document.querySelector('#Rphone').setAttribute('disabled', 'true');
    }

    document.getElementById('createAccountButtonId').onclick = async function () {
        //    grab all values..
        const firstName = document.querySelector('#RfName').value;
        const lastName = document.querySelector('#RlName').value;
        const email = document.querySelector('#Remail').value;
        const phone_value = document.querySelector('#Rphone').value;


        const __dat = {
            account_major: 'student',
            email: email,
            first_name: firstName,
            lastName: lastName,
            foreign_obligation: false,
            imei: ['', ''],
            last_name: lastName,
            obligated_user: null,
            obligation: false,
            phone_number: '0' + phone_value,
        }
            ;

        // const _addToStu = await db.collection('users/students/stu_pro_info').doc(uid).set();
        const prof = {
            'applied_promo': [],//object
            'available_promo': [],//object
            'avatar': '',//string
            'current_address': new firebase.firestore.GeoPoint(0, 0),//object
            'current_status': '',//string
            'email': email,//string
            'favourite_places': {},//object
            'first_name': firstName,//string
            'gender': '',//string
            'last_name': lastName,//string
            'next_rp_write': '',//string
            'next_rs_write': '',//string
            'payments': {
                'obligation_amount': '0',
                'obligation_currency': 'BDT',
                'penalty_paid': '0',
                'total_paid': '0'
            },//object
            'penalty': 0,//number
            'phone_number': '0' + phone_value,//string
            'previous_result': '',//string
            'pro_com_%': '',//string
            'rating_array': [],//object
            'recent_places': {},//object
            'recent_search': {},//object
            'referer_id': '',//string
            'referred': false,//boolean
            'saved_places': {}, //object
            'self_rating': {
                'dl_behaviour': "0",
                'dl_communication': "0",
                'l_behaviour': "1",
                'l_communication': "1",
                'star_count': "1",
                'star_rating': "5.00"
            },//object
            'unread_msg': '',//string
            'unread_noti': '',//string
            'unread_records': {
                'accepted_count': "0",
                'completed_count': "0",
                'current_count': "0",
                'pending_count': "0",
                'rejected_count': "0"
            },//object
            'user_ref_link': '',//string
        };
        try {
            const rid = showLoadingAnimation('Please Wait We\'re setting up your account!');
            const _addToMini = await db.collection('mini_users').doc(uid).set(__dat);
            const _addToProf = await db.collection('users/students/stu_pro_info').doc(uid).set(prof);
            console.log('Success');
            hideLoadingAnimation(rid);
            $('#regModalCenter').modal('hide');
            window.location.reload();
        } catch (e) {
            signOut();
            console.log('Contact service center. Critical Error: ', e);
        }
        // console.log(miniRef);
        // console.log(firstName + " " + lastName + " " + phone_value + " " + email + " " + uid);
    };

    $('#regModalCenter').modal('show');
}


function tryAgain() {
    let phn = document.getElementById('phone-number').value;
    localStorage.setItem('cph', phn);
    location.reload();
}

function signOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        location.reload();
    }).catch(function (error) {
        // An error happened.
    });
}

function setCardOptions(title, options, isMultipleAns) {
    resetCard();

    // const card = document.getElementById('option-card')
    document.getElementById('card-title').innerHTML = title;
    //console.log('passed opts', options);

    for (let i = 0; i < options.length; i++) {
        let d = document.createElement('div');
        let nodeHtml;
        if (isMultipleAns) {
            nodeHtml =
                `<div class="custom-control custom-checkbox mb-3">	
                <input type="checkbox" class="custom-control-input" id="opt_id${i}">	
                <label class="custom-control-label" for="opt_id${i}">${options[i]}</label>	
                </div>`;
        } else {
            if (options[i] === "Dance" || options[i] === "Art" || options[i] === "Music") {
                d.classList.add('d-none');
            }
            nodeHtml =
                `<div class="custom-control custom-radio mb-3">	
                <input type="radio" id="opt_id${i}" name="customRadio" class="custom-control-input">	
                <label class="custom-control-label" for="opt_id${i}">${options[i]}</label>	
                </div>`
        }

        d.innerHTML = nodeHtml;
        document.getElementById('card-desc').append(d);
    }

    if (isMultipleAns) {
        // console.log('last step');
        //Handle 'Next' Button manually.. and take to gender div..
        // we'll hide option card.. and show the gender div..


        document.getElementById('card-opt-next').onclick = null;
        document.getElementById('card-opt-next').addEventListener('click', () => {
            let lastOptionSubjects = getCurrentSelectedOptions();

            generateCommonQueryString(all_options_selected);

            for (let loopVar of lastOptionSubjects) {
                all_options_selected.push(loopVar);
                __selectedSubjects.push(loopVar);
            }

            // console.log('All selected options: ', all_options_selected);
            // document.getElementById('option-card').innerHTML = "<h5>Done! GO TO Other Selections!!</h5>";

            // document.getElementById('option-card').innerHTML = "";
            // document.getElementById('option-card').classList.add("d-none");
            // resetCard();
            lastStep();
        });
    }
}

function generateCommonQueryString(optionsArray) {
    for (const x of optionsArray) __commonQueryString += x.substr(0, 2);
}

function lastStep() {

    //document.getElementById('option-card').innerHTML = "";
    document.querySelector("#option-card").classList.add("d-none");
    console.log('last');
    document.querySelector("#option-card-final").classList.remove('d-none');
    document.querySelector("#tu-date").nodeValue = Date();
    const del = document.querySelector("#tu-date");

    let td = new Date();
    let dd = td.getDate();
    let mm = td.getMonth() + 1;

    const yyyy = td.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    del.value = dd + '-' + mm + '-' + yyyy;
    // console.log(dd + '-' + mm + '-' + yyyy, " -- ", del);
    del.value = yyyy + "-" + mm + "-" + dd;
    const ___tx = td.getHours() < 10 ? '0' + td.getHours() : td.getHours().toString();
    const ___ty = td.getMinutes() < 10 ? '0' + td.getMinutes() : td.getMinutes().toString();
    document.querySelector("#tu-time").value = ___tx + ":" + ___ty;


    const __DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //    set tuition days.. views
    const tutionDaysDiv = document.querySelector("#tuition-days-div");
    for (let li = 0; li < __DAYS.length; li++) {
        let currentNode =
            `<div class="custom-control custom-checkbox my-1 mr-sm-2">
                <input type="checkbox" class="custom-control-input" id="td-${li}">
                <label class="custom-control-label" for="td-${li}">${__DAYS[li]}</label>
            </div>`;
        if (li % 2 === 0) {
            currentNode =
                `<div class="custom-control custom-checkbox my-1 mr-sm-2">
                <input type="checkbox" class="custom-control-input" id="td-${li}" checked>
                <label class="custom-control-label" for="td-${li}">${__DAYS[li]}</label>
            </div>`;
        }
        const cDiv = document.createElement('div');
        cDiv.innerHTML = currentNode;
        tutionDaysDiv.appendChild(cDiv);
    }

    console.log(__commonQueryString, __selectedSubjects);
}


function setCardOptionsByPath() {
    let opts = getNodeByPath(root, currentPath);
    //console.log(opts);
    let temp = [];
    for (const i of opts) {
        temp.push(i.name);
    }
    let flag = opts[0].isEnd;
    setCardOptions(opts[0].title, temp, flag);
}

function resetCard() {
    const card = document.getElementById('option-card');
    //let opts = document.getElementsByClassName('custom-control-input');
    card.innerHTML =
        `<h5 id="card-title" class="card-header">Featured</h5>	
        <div id="card-desc" class="card-body"></div>	
        <div class="card-footer"><button type="button" id="card-opt-next" class="btn btn-secondary"	
        onclick="nextOptionsFlow()">Next</button>	
        </div>`
}

let currentOptions = [];
let currentPath = [];
let all_options_selected = [];

function nextOptionsFlow() {
    let x = getCurrentSelectedOptions();
    console.log('currently selected: ', x);
    for (const i of x) all_options_selected.push(i);
    setCardOptionsByPath();
}

function getCurrentSelectedOptions() {
    // get checked items after clicking next & before resetting card
    let inputOpts = document.getElementsByClassName('custom-control-input');
    let labelOpts = document.getElementsByClassName('custom-control-label');
    let selectedOptionLabels = [];

    for (let i in inputOpts) {
        if (!inputOpts.hasOwnProperty(i)) continue;
        if (inputOpts[i].checked) {
            currentPath.push(i);
            selectedOptionLabels.push(labelOpts[i].innerText);
        }
    }
    // console.log('selected lables: ', selectedOptionLabels);
    //console.log('Current path: ', currentPath);

    return selectedOptionLabels;
}

////////////*************************************************************************////////////////////

class Node {
    constructor(name, title, isEnd) {
        this.name = name;
        this.nodeList = [];
        this.title = title;
        this.isEnd = isEnd;
    }

    addNodes(nodeStrings, title, isEnd) {
        for (let i of nodeStrings) {
            let temp = new Node(i, title, isEnd);
            this.nodeList.push(temp);
        }
    }

    addMultipleNodes(nodeStrings, title, isEnd) {
        for (let i of nodeStrings) this.nodeList.push(new Node(i, title, isEnd));
    }
}

function addNodeByPath(root, path, nodesToAdd, title, isEnd, init = 0) {
    if (init >= path.length) {
        // console.log('Adding node to: ', root.name);
        root.addMultipleNodes(nodesToAdd, title, isEnd);
        return;
    }
    addNodeByPath(root.nodeList[path[init]], path, nodesToAdd, title, isEnd, init + 1);
}

function getNodeByPath(root, path, init = 0) {
    if (init >= path.length) {
        // console.log('target node: ', root.name);
        let ret = [];
        for (let i of root.nodeList) {
            // console.log(i.name);
            ret.push(i.name);
        }
        //  console.log('\n');
        return root.nodeList;
    }
    return getNodeByPath(root.nodeList[path[init]], path, init + 1);
}

let root = new Node("Catagories");

(function addPaths() {

    //first level
    addNodeByPath(root, [], ["Education", "Software", "Programming", "Language", "Dance", "Art", "Cooking", "Music", "Others"], "Select catagory", 0);

    // second level
    addNodeByPath(root, [0], ["School", "College", "University"], "Select Level", 0); // not end
    addNodeByPath(root, [1], ["Word", "Excel", "Powerpoint", "Adobe Illustrator", "Adobe PhotoShop", "Matlab", "Solid work", "AutoCad", "Adobe After Effect"], "Select Software", 1);
    addNodeByPath(root, [2], ["C", "Java", "C++", "C#", "JavaScript", "Python", "Web Development", "NodeJS", "Angular", "ReactJS", "VueJS", "Django", "Wordpress Development", "iOS Development", "Xamarin Cross Platform", "DotNet Framework", "Data Science", "Machine Learning"], "Select Programming Language", 1);
    addNodeByPath(root, [3], ["English", "Bangla", "French", "Spanish", "Japanese", "Korean", "German", "Hindi", "Chinese"], "Select Language", 1);
    addNodeByPath(root, [4], ["Classical", "Modern Dance", "Bollywood", "Contemporary"], "Select Dance", 1);
    addNodeByPath(root, [5], ["Therapeutic Art", "Digital Art", "Visual art", "Applied Art", "Performing Art", "Character Art"], "Select Field of Art", 1);
    addNodeByPath(root, [6], ["Bangla Cuisine", "Chinese Cuisine", "Baking", "Fast-Foods"], "Select Field of Cooking", 1);
    addNodeByPath(root, [7], ["Singing Course", "Instrumental"], "Select Field of Music", 0); // not end
    addNodeByPath(root, [8], ["Arabic (Quran)", "BCS", "IELTS", "SAT", "GRE", "GMAT", "Baby Sitting"], "Select Course", 1);


    addNodeByPath(root, [0, 0], ["Bangla Medium", "English Medium"], "Select Medium", 0);
    addNodeByPath(root, [0, 1], ["English Medium", "Bangla Medium", "English Version"], "Select Medium", 0);
    addNodeByPath(root, [0, 2], ["Engineering", "Medical", "Hons"], "Select Department", 0);
    addNodeByPath(root, [7, 0], ["Pop Singing", "Rock Singing", "Country/Classical Singing", "Blues/Jazz", "Hip Hop/Rap", "Adult Contemporay"], "Select Flavor", true);

    addNodeByPath(root, [7, 1], ["Electric Guitar", "Acoustic Guitar", "Spanish Guitar", "hawaiian Guitar", "Tabla", "Violin", "Keyboard", "Piano", "Drums"], "Select Field of Music", true);


    addNodeByPath(root, [0, 0, 0], ["Class One", "Class Two", "Class Three", "Class Four", "Class Five", "Class Six", "Class Seven", "JSC", "Science SSC", "Commerce SSC", "Arts SSC"], "Select Class", 0);
    addNodeByPath(root, [0, 0, 1], ["Class One", "Class Two", "Class Three", "Class Four", "Class Five", "Class Six", "Class Seven", "O Level Edexcel", "O Level Cambridge"], "Select Class", 0);
    addNodeByPath(root, [0, 1, 0], ["Edexcel As", "Edexcel A2", "Cambridge As", "Cambridge A2"], "Select Level", 0);
    addNodeByPath(root, [0, 1, 1], ["Science", "Commerce", "Arts"], "Select Group", 0);
    addNodeByPath(root, [0, 1, 2], ["Science", "Commerce", "Arts"], "Select Group", 0);

    addNodeByPath(root, [0, 2, 0], ["BME", "EEE", "AE", "CSE", "CE", "ME", "Architecture"], "Select Subject", true);
    addNodeByPath(root, [0, 2, 1], ["Anatomy", "Biochemistry", "Physiology", "Community Medicine", "Forensic", "Microbiology", "Pathology", "Pharmacology", "Gynecology", "Surgery", "Psychiatry"], "Select Subject", true);
    addNodeByPath(root, [0, 2, 2], ["Biotechnology", "Pharmacy", "Psychology", "BBA", "Economics", "Environmental Science", "Law(LLB)"], "Select Subject", true);


    addNodeByPath(root, [0, 0, 0, 0], ["Bangla", "English", "Math"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 0, 1], ["Bangla", "English", "Math"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 0, 2], ["Bangla", "English", "Math", "Religion", "General Science", "Social Science"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 0, 3], ["Bangla", "English", "Math", "Religion", "General Science", "Social Science"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 0, 4], ["Bangla", "English", "Math", "Religion", "General Science", "Social Science"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 0, 5], ["Bangla", "English", "Math", "Religion", "General Science", "Social Science", "Agriculture", "Domestic Science", "ICT"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 0, 6], ["Bangla", "English", "Math", "Religion", "General Science", "Social Science", "Agriculture", "Domestic Science", "ICT"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 0, 7], ["Bangla", "English", "Physics", "Chemistry", "Biology", "Math", "Higher Math", "Statistics", "ICT", "Bangladesh and Global Studies", "Religion"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 0, 8], ["Bangla", "English", "ICT", "Economics", "Finance and Banking", "Business Entrepreneurship", "Science", "Religion"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 0, 9], ["Bangla", "English", "ICT", "Geography and Environment", "History of Bangladesh and World Civilization", "Arts and Crafts", "Science", "Religion"], "Select Subject", true);

    addNodeByPath(root, [0, 0, 1, 0], ["Bangla", "English", "Math", "Geography", "History", "Science", "Religion"], "Select Subject", 1);
    addNodeByPath(root, [0, 0, 1, 1], ["Bangla", "English", "Math", "Geography", "History", "Science", "Religion"], "Select Subject", 1);
    addNodeByPath(root, [0, 0, 1, 2], ["Bangla", "English", "Math", "Geography", "History", "Science", "Religion"], "Select Subject", 1);
    addNodeByPath(root, [0, 0, 1, 3], ["Bangla", "English", "Math", "Geography", "History", "Science", "Religion"], "Select Subject", 1);
    addNodeByPath(root, [0, 0, 1, 4], ["Bangla", "English", "Math", "Geography", "History", "Science", "Religion"], "Select Subject", 1);
    addNodeByPath(root, [0, 0, 1, 5], ["Bangla", "English", "Math", "Geography", "History", "Science", "Religion"], "Select Subject", 1);
    addNodeByPath(root, [0, 0, 1, 6], ["Bangla", "English", "Math", "Geography", "History", "Science", "Religion"], "Select Subject", 1);
    addNodeByPath(root, [0, 0, 1, 7], ["Physics", "Chemistry", "Biology", "Math-B", "Pure Math", "English", "Bangla", "Accounting", "Economics", "Business"], "Select Subject", true);
    addNodeByPath(root, [0, 0, 1, 8], ["Physics", "Chemistry", "Biology", "Math-B", "Pure Math", "English", "Bangla", "Accounting", "Economics", "Business"], "Select Subject", true);

    addNodeByPath(root, [0, 1, 0, 0], ["Physics", "Chemistry", "Biology", "Math", "Further Math", "Psychology", "Accounting", "Economics", "Business"], "Select Subject", true);
    addNodeByPath(root, [0, 1, 0, 1], ["Physics", "Chemistry", "Biology", "Math", "Further Math", "Psychology", "Accounting", "Economics", "Business"], "Select Subject", true);
    addNodeByPath(root, [0, 1, 0, 2], ["Physics", "Chemistry", "Biology", "Math", "Further Math", "Psychology", "Accounting", "Economics", "Business"], "Select Subject", true);
    addNodeByPath(root, [0, 1, 0, 3], ["Physics", "Chemistry", "Biology", "Math", "Further Math", "Psychology", "Accounting", "Economics", "Business"], "Select Subject", true);

    addNodeByPath(root, [0, 1, 1, 0], ["English", "Physics", "Chemistry", "Biology", "Math", "Higher Math", "Statistics", "ICT"], "Select Subject", true);
    addNodeByPath(root, [0, 1, 1, 1], ["English", "Bangla", "Accounting", "Business Organization and Management", "ICT", "Finance, Banking & Insurance", "Production Management & Marketing", "Statistics", "Economics", "Geography"], "Select Subject", true);
    addNodeByPath(root, [0, 1, 1, 2], ["English", "Bangla", "ICT", "Parent Policy", "Economics", "Psychology", "Logic", "Social Science", "Agriculture", "Geography"], "Select Subject", 1);

    addNodeByPath(root, [0, 1, 2, 0], ["English", "Physics", "Chemistry", "Biology", "Math", "Higher Math", "Statistics", "ICT"], "Select Subject", true);
    addNodeByPath(root, [0, 1, 2, 1], ["English", "Bangla", "Accounting", "Business Organization and Management", "ICT", "Finance, Banking & Insurance", "Production Management & Marketing", "Statistics", "Economics", "Geography"], "Select Subject", true);
    addNodeByPath(root, [0, 1, 2, 2], ["English", "Bangla", "ICT", "Parent Policy", "Economics", "Psychology", "Logic", "Social Science", "Agriculture", "Geography"], "Select Subject", true);
})();


/////***********************************  Final Card (Make Queries to DB..)  *************************************************/
async function preferencesNextButtonClick() {
    document.querySelector('#option-card-final').classList.add('d-none');
    document.querySelector('#confirmPosition').classList.add('d-none');

    // gather all value & generate common query string
    // console.log(__commonQueryString);
    // console.log(__commonQueryString, __selectedSubjects, window.selectedLocation);

    const skillRef = db.collection('users/mentors/mentor_profile'); // db is in the firebase script

    const studentLocation = {
        lat: parseFloat(window.selectedLocation.lat),
        lon: parseFloat(window.selectedLocation.lng)
    };

    document.getElementById('select-loc').classList.remove('d-none');

    const stDate = new Date(document.querySelector("#tu-date").value);
    const stTime = document.querySelector("#tu-time").value;
    const _h = parseInt(stTime.substr(0, 2)), _m = parseInt(stTime.substr(3));
    let _time_string = "";
    if (_h >= 12) {
        let ts = _h - 12;
        _time_string = ts.toString() + ":" + _m + " PM";
    } else {
        _time_string = _h.toString() + ":" + _m + " AM";
    }

    const __DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let days_string = "";
    let daysInt = [];
    let separator = "";
    $("#tuition-days-div input:checkbox").each((index, dayElement) => {
        if (dayElement.checked) {
            console.log(index);
            days_string += separator + __DAYS[index];
            daysInt.push(index + 1);
            separator = ", ";
        }
    });
    // console.log(days_string, daysInt);


    const searchData = {
        "selectedInt": [],
        "gender": document.querySelector('#search-gender').value,
        "salary_min": parseInt(document.querySelector("#tu-salary-st").value),
        "salary_max": parseInt(document.querySelector("#tu-salary-ed").value),
        "start_time": {
            "hour_of_day": _h,
            "minute": _m,
            "time_string": _time_string
        },
        "start_date": {
            "date_string": stDate.toDateString().substr(4),
            "day_of_month": parseInt(stDate.toDateString().substr(8, 2)),
            "month": stDate.getMonth() + 1,
            "year": stDate.getFullYear()
        },
        "preferred_days": {
            "days_per_week": daysInt.length,
            "selectedDaysInt": daysInt,
            "selected_days": days_string
        },
    };
    console.log(searchData);


    await searchMarkAndEnlistAsync(searchData, skillRef, studentLocation, 2, __commonQueryString);
    drawCircleInMap(2);
}


/************************ DB_STUFFS ******************************/
let listedTeachers = [];

async function searchMarkAndEnlistAsync(searchData, collectionRef, center, MAX_DISTANCE, commonQueryString) {

    const loadingId = showLoadingAnimation("Searching for Mentors!!");

    let geoRegions = getQueriesForDocumentsAround(collectionRef, center, MAX_DISTANCE, "g", commonQueryString);
    for (const query of geoRegions) {
        let allSnap = await query.get();

        allSnap.forEach(doc => {
            let data = doc.data(); // whole mentor profile, this will be kept inside sp_info
            let dat_loc = {
                lat: data.l.latitude,
                lng: data.l.longitude
            };

            if (__loggedInUser.uid == doc.id) return;
            const sal = data[__commonQueryString].salary;
            if (sal > searchData.salary_max || sal < searchData.salary_min) return;

            let _dis = distance([data.l.latitude, data.l.longitude], [center.lat, center.lon]);
            let skipTeacher = false;
            if (_dis <= MAX_DISTANCE) {

                // match subjects and other stuffs...
                let queryList = data[__commonQueryString].query_list;
                queryList = queryList[queryList.length - 3];
                // strictly filtering mentors...
                // they must teach all of the students' selected subjects..
                const mentorTakenSubjects = queryList.split(','); /*data[__commonQueryString].jizz.Subject.split(',');*/
                for (let i = 0; i < mentorTakenSubjects.length; i++) {
                    mentorTakenSubjects[i] = mentorTakenSubjects[i].trim();
                }
                if ((searchData.gender != data.gender) && (searchData.gender != "Any")) {
                    return;
                    skipTeacher = true;
                }
                for (const i of __selectedSubjects) {
                    if (!mentorTakenSubjects.includes(i)) {
                        skipTeacher = true;
                        return;
                        // break;
                    }
                }
                // console.log('skip: ', skipTeacher, 'For: ', data);

                if (!skipTeacher) {
                    let marker = new google.maps.Marker({
                        position: dat_loc,
                        map: window.myMap,
                        // title: data.sp_info.first_name + " " + data.sp_info.last_name,
                        icon: {
                            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        }
                    });
                    data.mentor_uid = doc.id;
                    listedTeachers.push(data);
                }
            }
        });
    }

    // Listing teachers
    // show an available teachers list to student from `listedTeachers`
    // console.log("End of setting data:", listedTeachers);
    /// display a list of available list of teachers...

    //    now we'll grab data from Search Preferences
    let parentDiv = document.querySelector('#teacher-list');

    const availableTitle = document.createElement('p');
    availableTitle.innerHTML = `<p class="text-center lead">Available Teachers</p>`;
    parentDiv.appendChild(availableTitle);

    let pos = 0;

    for (const mentorProfile of listedTeachers) {
        let node = document.createElement('div');
        let requestButton = document.createElement('div');

        requestButton.onclick = async function () {
            await onTeacherItemClicked(searchData, mentorProfile);
        };

        let ratingStr = '';
        const ratImg = `<img src="./assets/img/star.svg" alt="rating" style="width: 1.5rem;height: 1rem;">`;
        for (let i = 0; i < parseInt(mentorProfile.self_rating.star_rating); i++) ratingStr += ratImg;

        node.innerHTML = `<div class="listed-teacher-wrapper">
                        <div class="d-flex justify-content-center">
                            <img src="./assets/img/user.svg" style="height: 5rem;width: 5rem;" alt="Mentor Image">
                        </div>
                        <div class="d-flex justify-content-center">
                            <h5 class="">${mentorProfile.first_name + " " + mentorProfile.last_name}</h5>
                        </div>
                        <div class="d-flex justify-content-center">
                            <p class="">${ratingStr}</p>
                        </div>
                        <div id="${"requestButtonWrapper" + pos}" class="d-flex justify-content-center">
                        </div>
                        <hr>
                        <p class="lead">Location: ${getAddressByLatLon(mentorProfile.l.latitude, mentorProfile.l.longitude)} </p>
                        <p class="lead">Expected Salary: ${mentorProfile[commonQueryString].salary} ৳</p>
                        <p class="lead">Current Status: ${mentorProfile.current_status}</p>
                    
                        <!--Academics-->
                        <p class="lead">Academic qualifications</p>
                        
                        <ul class="list-group" id="${"academic-list" + pos}">
                                <!--<li class="list-group-item">
                                    <p>Degree:</p>
                                    <p>From: To:</p>
                                    <p>Result</p>
                                </li>
                                
                                <li class="list-group-item">
                                    <p>Degree</p>
                                    <p>From</p>
                                    <p>To</p>
                                    <p>Result</p>
                                </li>-->        
                        </ul>
                    </div>`;


        parentDiv.appendChild(node);
        requestButton.innerHTML = `<button class="btn btn-outline-success d-flex justify-content-end request-this-teacher-btn" style="">Request this Teacher</button>`;
        document.querySelector("#requestButtonWrapper" + pos).appendChild(requestButton); /*to solve request button click*/

        setUpAcademics("academic-list" + pos, mentorProfile);


        pos++;
    }
    hideLoadingAnimation(loadingId);
}

async function getAddressByLatLon(latitude, longitude) {
    const url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyDFnedGL4qr_jenIpWYpbvot8s7Vuay_88";
    const req = await fetch(url);
    const resp = await req.json();
    //  console.log(resp);

    return "";
    return resp.results[0].formatted_address;
}

async function setUpAcademics(listGroupId, mentorProfile) {
    const listGroup = document.getElementById(listGroupId);
    const academic = mentorProfile.academic; //map

    Object.keys(academic).forEach((value => {
        //   console.log(academic[value]);
        const _degree = academic[value].degree;
        const _from_year = academic[value].from_year;
        const _institution = academic[value].institution;
        const _level = academic[value].level;
        const _to_year = academic[value].to_year;
        const _result = academic[value].result;

        const _liElement = document.createElement('li');
        _liElement.classList.add('list-group-item');
        _liElement.innerHTML = `    <p>${_degree}, ${_institution}</p>
                                    <p>${_from_year} - ${_to_year}</p>
                                    <p>Result: ${_result}</p>`;
        listGroup.appendChild(_liElement);
    }));

    /*for (const degree of academic) {
        if (!academic.hasOwnProperty(degree)) continue;
        // ssc..hsc..bsc etc..
        console.log(degree);
    }*/

}

async function onTeacherItemClicked(searchData, mentorProfile) {
    const studentUid = __loggedInUser.uid;
    const mentorUid = mentorProfile.mentor_uid;

    const stRef = await db.collection('users/students/stu_pro_info').doc(studentUid);
    const studentProfile = (await stRef.get()).data();

    await createRecord(searchData, mentorProfile, studentProfile, studentUid, mentorUid);

}

function drawCircleInMap(radiusInKm) {
    const center = {
        lat: window.selectedLocation.lat, lng: window.selectedLocation.lng
    };

    let cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: window.myMap,
        center: center,
        radius: radiusInKm * 1000
    });

    let centerMarker = new google.maps.Marker({
        position: center,
        map: window.myMap,
        icon: { url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/info-i_maps.png' }
    });
}


async function createRecord(searchData, mentorProfileData, studentProfile, studentUid, mentorUid) {

    const lid = showLoadingAnimation("Requesting Selected Mentor");

    const mentorCommonQueryMap = mentorProfileData[__commonQueryString]; // from mentors common_query_string (name) map
    let record = {
        "anchor_point": new firebase.firestore.GeoPoint(window.selectedLocation.lat, window.selectedLocation.lng), //object, students anchor point
        "common_query_str": __commonQueryString, //string,
        "creation": firebase.firestore.Timestamp.fromDate(new Date()), //object,
        "dislikes": mentorCommonQueryMap.dislikes, //object, from mentor
        "enrolled": mentorCommonQueryMap.enrolled, //number, from mentor
        "for_whom": {
            "is_self": true,
            "request_avatar": studentProfile.avatar,
            "request_cs": "",
            "request_email": studentProfile.email,
            "request_gender": studentProfile.gender,
            "request_phone_number": studentProfile.phone_number,
            "request_pr": "",
            "request_sr": studentProfile.self_rating,
            "request_uid": studentUid,
            "request_user_name": studentProfile.first_name + " " + studentProfile.last_name,
            "stu_name": studentProfile.first_name + " " + studentProfile.last_name,
            "stu_phone_number": studentProfile.phone_number,
            "stu_photo": ""
        }, //object,
        "g": mentorProfileData.g, //string, mentors geohash
        "jizz": mentorCommonQueryMap.jizz, //object,
        "l": mentorProfileData.l, //object, mentors location
        "likes": mentorCommonQueryMap.likes, //object,
        "location": mentorCommonQueryMap.location, //object,
        "mentor_uid": mentorUid, //string,
        "package_name": "Regular Dume", //string,
        "participants": [mentorUid, studentUid], //object,
        "payment_added": false, //boolean,
        "payment_given": false, //boolean,

        "preferred_days": searchData.preferred_days, //object,

        "query_list": mentorCommonQueryMap.query_list, //object,
        "query_list_name": mentorCommonQueryMap.query_list_name, //object,
        "query_string": mentorCommonQueryMap.query_string, //string, differs from common query string
        "rating": mentorCommonQueryMap.rating, //number,
        "record_status": "Pending", //string,
        "rejected_by": "", //string,
        "request_letter": "", //string,
        "s_rate_status": "dialog", //string,
        "s_show_status": true, //boolean,
        "salary": mentorCommonQueryMap.salary, //number,
        "sh_uid": "S_" + studentUid, //string,
        "skill_uid": mentorCommonQueryMap.id, //string,
        "sp_info": mentorProfileData, //object, whole copy of mentors profile
        "sp_uid": "T_" + mentorUid, //string,

        "start_date": searchData.start_date, //object,
        "start_time": searchData.start_time, //object,

        "status": true, //boolean,
        "status_modi_date": firebase.firestore.Timestamp.fromDate(new Date()), //object,
        "t_rate_status": "dialog", //string,
        "t_show_status": true, //boolean,
        "totalRating": 0, //number,
        "user_uid": studentUid, //string
    };
    // console.log(record);

    //show a loading animation here..

    // TODO --> await
    // db.collection("records").add(record).then(docRef => {
    //     // console.log("Document written with ID: ", docRef.id);

    // }).catch(error => console.error("Error adding document: ", error));
    //    firebase.firestore.FieldValue.serverTimestamp()

    try {
        const _mkRec = await db.collection("records").add(record);
        showClosableModal('Requested Menotor!',
            'Request is sent, please wait for response from mentor.', true);
        // window.location.reload();
    } catch (error) {
        showClosableModal('Request failed!',
            'Request can\'t be sent, please try again.', true);
        console.log(error);
    } finally {
        hideLoadingAnimation(lid);
        // window.location.reload();
    }
}

function showClosableModal(title, body, reload) {
    let str = Math.random().toString(36).substring(7);
    const _html = `<!-- Modal -->
        <div class="modal fade" id="${str}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"  data-keyboard="false" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-body text-center">
                <p>${title}</p>
                <p>${body}</p>
                <button type="button" id="rbt${str}" class="btn btn-secondary text-center" data-dismiss="modal">Done</button>
              </div>
            </div>
          </div>
        </div>`;

    const span = document.createElement('span');
    span.innerHTML = _html;
    document.getElementsByTagName('body')[0].appendChild(span);

    $('#' + str).modal('show');

    if (reload) {
        document.getElementById('rbt' + str).onclick = () => {
            window.location.reload();
        }
    }
}

function showLoadingAnimation(title) {

    let str = Math.random().toString(36).substring(7);

    const _html = `<!-- Modal -->
        <div class="modal fade" id="${str}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"  data-keyboard="false" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-body text-center">
                <p>${title}</p>
                <img src="../../assets/img/loading_animation.gif" alt="loading">
              </div>
            </div>
          </div>
        </div>`;

    const span = document.createElement('span');
    span.innerHTML = _html;
    document.getElementsByTagName('body')[0].appendChild(span);

    $('#' + str).modal('show');

    return str;
}

function hideLoadingAnimation(id) {
    $('#' + id).modal('hide');
}

/*
const tRef = db.collection('records');
let _ps = "";

tRef.doc("baXQJLes94PSkSGJ0xGs").get().then(docSnap => {
    let dat = docSnap.data();
    console.log("let record = {\n");
    for (let p in dat) {
        _ps += "\"" + p.toString() + "\":, " + "\/\/" + typeof dat[p] + ",\n";
    }
    console.log(dat);
    console.log(_ps);
    console.log("};\n");
    console.log();
});
*/
