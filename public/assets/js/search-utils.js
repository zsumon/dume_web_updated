$(async function () {
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            await loadRecentTuition(user.uid);
            $('#your-tuition-wrapper').removeClass('d-none');
            document.querySelector('#delete-all-rej-btn').onclick = async () => {
                await deleteAllRejectedRecords(user.uid);
            };

        }
    });

});

async function deleteAllRejectedRecords(userUid) {
    // console.log(userUid);
    // assert(userUid !== null);
    const rrr = showLoadingAnimation("Deleting All REJECTED Records.");

    try {
        const querySnap = await db.collection('records').where('user_uid', '==', userUid).get();
        querySnap.forEach(async (docSnap) => {
            const ds = await docSnap.ref.delete();
            // console.log(ds);
        });
    } catch (error) {
        console.log(error);

    } finally {
        hideLoadingAnimation(rrr);
    }
}

async function loadRecentTuition(studentUid) {
    const recRef = db.collection('records').where('user_uid', '==', studentUid).where('record_status', '==', 'Pending');
    const querySnap = await recRef.get();
    let recCount = 0;
    querySnap.forEach(docSnap => {

        const data = docSnap.data();
        ++recCount;

        // console.log('snaaaaaaaap=>', docSnap.id, data);
        // return;

        const tList = document.querySelector('#tuition-list');
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('list-group-item');

        let ratingStr = '';
        const ratImg = `<img src="./assets/img/star.svg" alt="rating" style="width: 1.5rem;height: 1rem;">`;

        for (let i = 0; i < parseInt(data.sp_info.self_rating.star_rating); i++)
            ratingStr += ratImg;
        let subs = data.query_list;
        subs.pop();
        subs.pop();

        let modifiedSubs = "";
        let separator = "";

        for (const i of subs) {
            modifiedSubs += separator + i;
            separator = " > ";
        }

        const dateCreated = data.creation.toDate();
        let h = padd(dateCreated.getHours());
        let m = padd(dateCreated.getMinutes());
        let ampm = ' AM';
        if (parseInt(h) >= 12) {
            ampm = " PM";
            h = (parseInt(h) - 11).toString();
        }
        let _dd = padd(dateCreated.getDate());
        let _mm = padd((parseInt(dateCreated.getMonth()) + 1).toString());
        let _yy = dateCreated.getFullYear();

        function padd(__val) {
            return __val.length < 2 ? "0" + __val : __val;
        }
        wrapperDiv.innerHTML = `<div class="text-center">
                        <img style="height: 3rem;width: 3rem;" src="./assets/img/user.svg" class="rounded-circle"
                             alt="Cinque Terre" width="250" height="250">
                        <p>${data.sp_info.first_name + " " + data.sp_info.last_name}<br>${ratingStr}</p>
                        <p>Location: ${data.sp_info.location}</p>
                        <div class="texr-center">
                            <p>Tuition Status: ${data.record_status}</p> 
                            <button class="btn btn-outline-secondary" id="cancel-pending-req${recCount}">Cancel</button>
                        </div>
                        
                        <p>Created at: ${h + ":" + m + ampm + ", " + _dd + "-" + _mm + "-" + _yy} </p>
                        <p> Subject: ${modifiedSubs}</p>
                        <p>Salary: ${data.salary} ৳</p>
                        <p>Contact: ${data.sp_info.phone_number}</p>
                        </div>`;
        tList.appendChild(wrapperDiv);

        document.querySelector('#cancel-pending-req' + recCount).onclick = async () => {
            data.record_status = 'Rejected';
            data.rejected_by = 'student';
            console.log('rejecting', docSnap.id);

            try {
                const rid = showLoadingAnimation('Please Wait Rejecting Request');
                const _updId = await db.collection('records').doc(docSnap.id).set(data);
                // console.log(_updId);
                hideLoadingAnimation(rid);
                window.location.reload();
            } catch (error) {
                console.log('cant reject pending req.', error);
            }
        }
    });
}

function recentTuitionCollapse(btn) {
    if (btn.innerText === "Show Recent Tuition") {
        btn.innerText = "Hide Recent Tuition";
    } else {
        btn.innerText = "Show Recent Tuition";
    }
}


/*
const ff = () => {
    db.collection('users/students/stu_pro_info').where('phone_number', '==', '01536100076').get().then((qs) => {
        qs.forEach((docSnap) => {
            const data = docSnap.data();
            // console.log(data);
            let str = '';
            for (const i of Object.keys(data)) {
                str += '\'' + i + '\'' + ':,\/\/' + typeof data[i] + '\n';
            }
            console.log(str);
            return;
        });
    });
};
ff();
*/
