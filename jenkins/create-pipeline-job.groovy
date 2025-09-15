import jenkins.model.*
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import hudson.plugins.git.GitSCM

def jenkins = Jenkins.get()
def jobName = 'reminder-app-pipeline'
def gitRepoUrl = 'https://github.com/MeetMRP/Reminder-app'

if (jenkins.getItemByFullName(jobName) != null) {
    println("Job '${jobName}' already exists. Skipping creation.")
    return
}

println("Creating new pipeline job: '${jobName}'")

def job = jenkins.createProject(WorkflowJob, jobName)
def scm = new GitSCM(gitRepoUrl)

// Change 'jenkins/Jenkinsfile' to 'Jenkinsfile' if it's at root
job.setDefinition(new CpsScmFlowDefinition(scm, 'jenkins/Jenkinsfile'))

job.save()
println("Successfully created job: '${jobName}'")
