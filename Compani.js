class Company { // класс компаниии
  constructor () {
    this.developers = [] // разрабы
    this.projects = [] // проекты
    this.hiredDevelopersCount = 0 // число нанятых разрабов
    this.dismissedDevelopersCount = 0 // число уволеных разрабов
    this.freeDevelopersCount = 0 // число свободных разрабов
    this.completedProjectsCounter = 0
    this.dismissalCandidate = null
    // this.departments = []

  // for (let current = 0 current < 3 current++) {
  //     this.departments.push(new Department(types[current]))
  // }
  }

  addDeveloper (developer) { // нанятие разраба
    ++this.hiredDevelopersCount
    this.developers.push(developer)
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
}
module.exports = Company
