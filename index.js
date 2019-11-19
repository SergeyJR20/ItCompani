/*
В фирме есть директор, который отвечает за набор сотрудников и получение новых проектов. В фирме также есть 3 отдела:
 веб отдел, мобильный отдел и отдел тестирования в которых могут работать только соответственно веб разработчики,
  мобильные разработчики и QA специалисты. Каждый день директор может получить от нуля до 4 новых проектов одного из 2
   типов (веб/мобильный), каждый из которых может быть трех уровней сложности.

Полученные проекты директор пытается передать в отделы учитывая их специализацию. В случае если в отделе недостаточно
 работников, то отдел принимает только проекты на реализацию которых есть ресурсы, а оставшиеся проекты остаются у
  директора на следующий день.

На следующий день директор нанимает необходимое количество программистов для реализации вчерашних проектов и передает
 их по отделам. В случае если в отделе, в момент получения проектов от директора есть свободные программисты, то веб
  программисты получают по 1 проекту на реализацию, а мобильные могут работать на 1 проекте вдвоем или втроем если
   сложность проекта 2 или 3 соответственно. В зависимости от сложности на реализацию нужно 1, 2 или 3 дня для 1
    разработчика, после чего проект должен перейти в отдел тестирования.

QA специалист тратит на тестирование проекта любой сложности 1 день. После тестирования проект считается успешно
 реализованным и удаляется из системы. Программиста увольняют, если он более 3 дней подряд не занимался проектом. В
  случае если таких несколько, то каждый день из них увольняется только самый неопытный (участвовавший в наименьшем
     числе проектов).

На вход программы подается количество дней. На выходе статистика: количество реализованных проектов, нанятых и
 уволенных программистов. Начальные условия: в фирме нет проектов и нет программистов.
*/

//функции

//генерация рандомного числа
const getRandomInt = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//счётчик(при каждом новом вызове генерирует значение, которое на 1 выше предыдущего)
const Counter = function(){
    var i = 0;

    return function(){
        return i++;
    };
};

//константы
const types = ["web", "mobile", "QA"];
const projectId = new Counter(); //генерация id проектов
const developerId = new Counter(); //генерация id разработчиков

//классы

class Developer { //класс разработчик
    constructor(type) {
        this.id = developerId();
        this.type = type;
        this.isFree = false; //свободен ли
        this.freeDays = 0; //число потраченных дней
        this.completedProjectsCounter = 0; //число выполненных проектов
        //this.department = department;
    }
}

class Project { //класс проекта
    constructor(type, level) {
        this.id = projectId();
        this.type = type;
        this.level = level;
        this.isFree = true;
        this.isCompleted = false; //выполнен ли
        this.isTesting = false;

        this.developers = []; //число клерков, пыхтящих над ней
        this.QA_specialist = null;
    }

    start() { //начало разработки проекта
        this.days = 1 + this.level - this.developers.length; //высчитываются дни разработки в зависимости от числа трудящихся
        this.isFree = false;
    }

    test(developer) { //начало тестирования проекта
        this.QA_specialist = developer; //назначается QA специалист
        this.days = 1;
        this.isTesting = true;
    }

    addDeveloper(developer) { //добавление разраба в проект
        developer.freeDays = 0; //обнуляем потраченные дни со словами "опять работать!"
        this.developers.push(developer); //добавляем разработчика в массив
    }
}

//хз, зачем сделал класс отдела разработки. Чисто технически он тут  не нужен

// class Department {
//     constructor(type) {
//         this.type = type;
//         this.projects = [];
//     }

//     addProject(project) {
//         if (this.projects.length < 4) {
//             this.projects.push(project);
//         } else {
//             console.log("Массив переполнен!");
//         }
//     }
//     clearProjects() {
//         this.projects.length = 0;
//     }
// }

class Company { //класс компаниии
    constructor() {
        this.developers = []; //разрабы
        this.projects = []; //проекты
        this.hiredDevelopersCount = 0; //число нанятых разрабов
        this.dismissedDevelopersCount = 0; //число уволеных разрабов
        this.freeDevelopersCount = 0; //число свободных разрабов
        this.completedProjectsCounter = 0;

        this.dismissalCandidate = null;

        //this.departments = [];

        // for (let current = 0; current < 3; current++) {
        //     this.departments.push(new Department(types[current]));
        // }
    }
    addDeveloper(developer) { //нанятие разраба
        ++this.hiredDevelopersCount;
        this.developers.push(developer);
    }

    addProject(project) { //нахождение нового проекта
    }

    removeDeveloper() {
        for (let index in this.developers) {
            if (this.developers[index].id == this.dismissalCandidate.id) {
                this.developers.splice(index, 1);
            }
        }
        this.dismissalCandidate = null;
        ++this.dismissedDevelopersCount;
    }
    removeProject(id) {
        for (let index in this.projects) {
            if (this.projects[index].id == id) {
                this.projects.splice(index, 1);
            }
        }
    }
}

//главный процесс

const main = function() {
    let days = 10; //генерация дней(аналог ручного ввода)

    let company = new Company();

    for (let day = 0; day < days; day++) { //переворачиваем календарь)

        for (let developer of company.developers) {
            if (developer.isFree && developer.freeDays <= 3) {
                ++developer.freeDays;
            } else if (developer.isFree && developer.freeDays > 3) {
                if (company.dismissalCandidate == null) {
                    company.dismissalCandidate = developer;
                } else if (company.dismissalCandidate != null && company.dismissalCandidate.completedProjectsCounter > developer.completedProjectsCounter) {
                    company.dismissalCandidate = developer;
                }
            }
        }
        if (company.dismissalCandidate != null) {
            company.removeDeveloper();
        }

        for (let project of company.projects) { //смотрим уже существующие проекты
            if (!project.isCompleted && project.isFree && company.freeDevelopersCount == 0) { //если проект свободен, но свободных разрабов нет
                let developer = new Developer(project.type); //нанимаем нового клерка
                company.addDeveloper(developer); //добавляем его в компанию
                project.addDeveloper(developer); //и сажаем на  на новый проект
                project.start(); //стартуем
            } else if (!project.isCompleted && project.isFree && company.freeDevelopersCount > 0) { //если проект свободен и свободные разрабы имеются
                for (let developer of company.developers) { //проходимся по разрабам
                    if (developer.isFree && developer.type == project.type) { //если разраб свободен и его компетенция совпадает с проектом
                        project.addDeveloper(developer); //сажаем его на проект
                        --company.freeDevelopersCount; //минусуем свободных разрабов
                        if (project.type == "mob") { //если проект мобильный, одного разраба хватит
                            project.start();
                        } else if (project.type == "web" && project.developers.length == project.level) { //если это сайт, стартуем, когда число разрабов будет соответствовать уровню проекта
                            project.start();
                        }
                    }
                }
                if (project.isFree && project.developers.length > 0) { //если после всего перечисленного проект ещё свободен и число посаженных разрабов больше чем 0, то стартуем
                    project.start();
                }
            } else if (!project.isCompleted && !project.isFree && project.days != 0) { //если проект занят и сроки не поджимают
                --project.days; //просто отсчитываем дни
            } else if (!project.isCompleted && !project.isFree && project.days == 0) { //если проект занят и дедлайн
                project.isCompleted = true; //проект считается выполненным(но это неточно)
                for (let developer of project.developers) { //проходим по участникам проекта и освобождаем их
                    developer.isFree = true;
                    ++developer.completedProjectsCounter; //+1 к выполненным проектам у разраба
                }
                company.freeDevelopersCount += project.developers.length; 
                project.developers.length = 0; //обнуляем массив

                for (let developer of company.developers) { //ищем для этого проекта подходящего тестировщика
                    if (developer.isFree && developer.type == 'QA') {
                        project.test(developer); //начало теста
                        --company.freeDevelopersCount;
                    }
                }
                if (project.QA_specialist == null) { //если тестировщиков нет, нанимаем нового
                    let developer = new Developer('QA');
                    company.addDeveloper(developer);
                    project.test(developer);
                }
            } else if (project.isCompleted && project.isTesting && project.days > 0) {
                --project.days;
            } else if (project.isCompleted && project.isTesting && project.days == 0) {
                project.QA_specialist.isFree = true;
                ++project.QA_specialist.completedProjectsCounter; //+1 к выполненным проектам у тестера
                ++company.freeDevelopersCount;
                ++company.completedProjectsCounter;
                project.QA_specialist = null;
                company.removeProject(project.id);
            }
        } 

        let projects = getRandomInt(5); //генерация новых проектов от 0 до 4

        for (let current = 0; current < projects; current++) {
            let project = new Project(types[getRandomInt(2)], getRandomInt(3) + 1);
            company.addProject(project); //добавляем их в компанию

            if (company.freeDevelopersCount > 0) { //если свободные разрабы имеются
                for (let developer of company.developers) { //проходимся по разрабам
                    if (developer.isFree && developer.type == project.type) { //если разраб свободен и его компетенция совпадает с проектом
                        project.addDeveloper(developer); //сажаем его на проект
                        --company.freeDevelopersCount; //минусуем свободных разрабов
                        if (project.type == "mob") { //если проект мобильный, одного разраба хватит
                            project.start();
                        } else if (project.type == "web" && project.developers.length == project.level) { //если это сайт, стартуем, когда число разрабов будет соответствовать уровню проекта
                            project.start();
                        }
                    }
                }
                if (project.developers.length > 0) { //если после всего перечисленного проект ещё свободен и число посаженных разрабов больше 0, то стартуем
                    project.start();
                }
            }
        }
    }
    console.log(`   Количество реализованных проектов: ${company.completedProjectsCounter}
    Число нанятых программистов: ${company.hiredDevelopersCount}
    Число уволенных программистов: ${company.dismissedDevelopersCount}`);
}
main();
