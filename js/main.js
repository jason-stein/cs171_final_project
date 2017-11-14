introJs().showHints();

function CourseCount() {
    $('#CourseCount')
        .prop('Counter',0)
        .animate({ Counter: 350000 }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    }

function InstructorsCount() {
    $('#InstructorCount')
        .prop('Counter',0)
        .animate({ Counter: 14781 }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
}

function SubjectCount() {
    $('#SubjectCount')
        .prop('Counter',0)
        .animate({ Counter: 1070 }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
}

function TermCount() {
    $('#TermCount')
        .prop('Counter',0)
        .animate({ Counter: 250 }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
}

function DepartmentCount() {
    $('#DepartmentCount')
        .prop('Counter',0)
        .animate({ Counter: 126 }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
}


function move() {
    var elem = document.getElementById("myBar");
    var width = 1;
    var id = setInterval(frame, 20);
    function frame() {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}



