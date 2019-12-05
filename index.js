const getRandomInt = function (max) {
  return Math.floor(Math.random() * Math.floor(max))
}
// счётчик(при каждом новом вызове генерирует значение, которое на 1 выше предыдущего)
const Counter = function () {
  var i = 0
  return function () {
    return i++
  }
}

// константы
const types = ['web', 'mobile', 'QA']
const projectId = new Counter() // генерация id проектов
const developerId = new Counter() // генерация id разработчиков

// классы

class Developer { // класс разработчик
  constructor (type) {
    this.id = developerId()
    this.type = type
    this.isFree = false // свободен ли
    this.freeDays = 0 // число потраченных дней
    this.compconstedProjectsCounter = 0 // число выполненных проектов
    // this.department = department
  }

  freeDevelopers (developers) {
    for (const developer of developers) { // проходим по участникам проекта и освобождаем их
      developer.isFree = true
      ++developer.compconstedProjectsCounter // +1 к выполненным проектам у разраба
    }
  }

  qa (project) {
    for (const developer of it.company.developers) { // ищем для этого проекта подходящего тестировщика
      if (developer.isFree && developer.type === 'QA') {
        project.test(developer) // начало теста
        --it.company.freeDevelopersCount
      }
    }
  }

  addQA (project) {
    if (project.QA_specialist == null) { // если тестировщиков нет, нанимаем нового
      const developer = new Developer('QA')
      it.company.addDeveloper(developer)
      project.test(developer)
    }
  }
}

class Project { // класс проекта
  constructor (type, level) {
    this.id = projectId()
    this.type = type
    this.level = level
    this.isFree = true
    this.isCompconsted = false // выполнен ли
    this.isTesting = false

    this.developers = [] // число клерков, пыхтящих над ней
    this.QA_specialist = null
  }

  start () { // начало разработки проекта
    this.days = 1 + this.level - this.developers.length // высчитываются дни разработки в зависимости от числа трудящихся
    this.isFree = false
  }

  test (developer) { // начало тестирования проекта
    this.QA_specialist = developer // назначается QA специалист
    this.days = 1
    this.isTesting = true
  }

  addDeveloper (developer) { // добавление разраба в проект
    developer.freeDays = 0 // обнуляем потраченные дни со словами 'опять работать!'
    this.developers.push(developer) // добавляем разработчика в массив
  }

  distributionOfDevelopers (project) {
    for (const developer of it.company.developers) { // проходимся по разрабам
      if (developer.isFree && developer.type === project.type) { // если разраб свободен и его компетенция совпадает с проектом
        project.addDeveloper(developer) // сажаем его на проект
        --it.company.freeDevelopersCount // минусуем свободных разрабов
        if (project.type === 'mob') { // если проект мобильный, одного разраба хватит
          project.start()
        } else if (project.type === 'web' && project.developers.length === project.level) { // если это сайт, стартуем, когда число разрабов будет соответствовать уровню проекта
          project.start()
        }
      }
    }
  }
}

// class Department {
//   constructor (type) {
//     this.type = type
//     this.projects = []
//   }

//   addProject (project) {
//     if (this.projects.length < 4) {
//       this.projects.push(project)
//     } else {
//       console.log('Массив переполнен!')
//     }
//   }

//   clearProjects () {
//     this.projects.length = 0
//   }
// }

class Company { // класс компаниии
  constructor () {
    this.developers = [] // разрабы
    this.projects = [] // проекты
    this.hiredDevelopersCount = 0 // число нанятых разрабов
    this.dismissedDevelopersCount = 0 // число уволеных разрабов
    this.freeDevelopersCount = 0 // число свободных разрабов
    this.compconstedProjectsCounter = 0
    this.developer = null

    this.dismissalCandidate = null
  }

  addDeveloper (developer) { // нанятие разраба
    ++this.hiredDevelopersCount
    this.developers.push(developer)
  }

  addProject (project) { // нахождение нового проекта
  }

  removeDeveloper () {
    for (const index in this.developers) {
      if (this.developers[index].id === this.dismissalCandidate.id) {
        this.developers.splice(index, 1)
      }
    }
    this.dismissalCandidate = null
    ++this.dismissedDevelopersCount
  }

  removeProject (id) {
    for (const index in this.projects) {
      if (this.projects[index].id === id) {
        this.projects.splice(index, 1)
      }
    }
  }

  dismissedDevelopers () {
    for (const developer of this.developers) {
      if (developer.isFree && developer.freeDays <= 3) {
        ++developer.freeDays
      } else if (developer.isFree && developer.freeDays > 3) {
        if (this.dismissalCandidate == null) {
          this.dismissalCandidate = developer
        } else if (this.dismissalCandidate != null && this.dismissalCandidate.compconstedProjectsCounter > developer.compconstedProjectsCounter) {
          this.dismissalCandidate = developer
        }
      }
    }
    if (this.dismissalCandidate != null) {
      this.removeDeveloper()
    }
  }

  workWithProject () {
    for (const project of it.company.projects) { // смотрим уже существующие проекты
        if (!project.isCompconsted && project.isFree && it.company.freeDevelopersCount === 0) { // если проект свободен, но свободных разрабов нет
          this.developer = new Developer(project.type) // нанимаем нового клерка
          it.company.addDeveloper(this.developer) // добавляем его в компанию
          project.addDeveloper(this.developer) // и сажаем на  на новый проект
          project.start() // стартуем
        } else if (!project.isCompconsted && project.isFree && it.company.freeDevelopersCount > 0) { // если проект свободен и свободные разрабы имеются
        project.distributionOfDevelopers(project)
          if (project.isFree && project.developers.length > 0) { // если после всего перечисленного проект ещё свободен и число посаженных разрабов больше чем 0, то стартуем
            project.start()
          }
        } else if (!project.isCompconsted && !project.isFree && project.days !== 0) { // если проект занят и сроки не поджимают
          --project.days // просто отсчитываем дни
        } else if (!project.isCompconsted && !project.isFree && project.days === 0) { // если проект занят и дедлайн
          project.isCompconsted = true // проект считается выполненным(но это неточно)

        this.developer.freeDevelopers(project.developers)

        it.company.freeDevelopersCount += project.developers.length
        project.developers.length = 0 // обнуляем массив

        this.developer.qa(project)

        this.developer.addQA(project)
      } else if (project.isCompconsted && project.isTesting && project.days > 0) {
        --project.days
      } else if (project.isCompconsted && project.isTesting && project.days === 0) {
        project.QA_specialist.isFree = true
        ++project.QA_specialist.compconstedProjectsCounter // +1 к выполненным проектам у тестера
        ++it.company.freeDevelopersCount
        ++it.company.compconstedProjectsCounter
        project.QA_specialist = null
        it.company.removeProject(project.id)
      }
    }
  }
}

// главный процесс

class IT {
  constructor () {
    this.days = 10 // генерация дней(аналог ручного ввода)
    this.company = new Company()
  }

  main () {

    for (let day = 0; day < this.days; day++) { // переворачиваем календарь)
      this.company.dismissedDevelopers()
      this.company.workWithProject()
      const projects = getRandomInt(5) // генерация новых проектов от 0 до 4
      for (let current = 0; current < projects; current++) {
        const project = new Project(types[getRandomInt(2)], getRandomInt(3) + 1)
        this.company.addProject(project) // добавляем их в компанию
        if (this.company.freeDevelopersCount > 0) { // если свободные разрабы имеются
          for (const developer of this.company.developers) { // проходимся по разрабам
            if (developer.isFree && developer.type === project.type) { // если разраб свободен и его компетенция совпадает с проектом
              project.addDeveloper(developer) // сажаем его на проект
              --this.company.freeDevelopersCount // минусуем свободных разрабов
              if (project.type === 'mob') { // если проект мобильный, одного разраба хватит
                project.start()
              } else if (project.type === 'web' && project.developers.length === project.level) { // если это сайт, стартуем, когда число разрабов будет соответствовать уровню проекта
                project.start()
              }
            }
          }
          if (project.developers.length > 0) { // если после всего перечисленного проект ещё свободен и число посаженных разрабов больше 0, то стартуем
            project.start()
          }
        }
      }
    }
    console.log(`   Количество реализованных проектов: ${this.company.compconstedProjectsCounter}
      Число нанятых программистов: ${this.company.hiredDevelopersCount}
      Число уволенных программистов: ${this.company.dismissedDevelopersCount}`)
  }
}

const it = new IT()
it.main()
