package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/sqweek/dialog"
)

func downloadFile(filepath string, url string) (err error) {

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Check server response
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	// Writer the body to file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return err
	}

	return nil
}

func install_nodejs() {
	node_js_url := "https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi"
	download_res := downloadFile("node-setup.msi", node_js_url)
	if download_res == nil {
		println("Error: NodeJs Installation Failed")
	}

	pwd, _ := os.Getwd()
	cmd := exec.Command("msiexec", "/i", pwd+"\\node-setup.msi")
	_, exec_err := cmd.Output()
	if exec_err != nil {
		fmt.Println("An Error Occur: Fail to Install NodeJs ", exec_err.Error())
	}
}

func load_url(url string) {
	_, err := exec.Command("powershell", "-command", "start", url).Output()
	if err != nil {
		println("Fail to load URL", err.Error())
	}
}

func run_bot() {

	cdir_err := os.Chdir("./whatsapp-ai-bot-master")
	if cdir_err != nil {
		println("Fail to change directory '/whatsapp-ai-bot-master'")
	}

	// input keys

	var open_ai_api_key string
	var stability_ai_api_key string

	open_ai_url := "https://platform.openai.com/account/api-keys"
	stability_ai_url := "https://platform.stability.ai/docs/getting-started/authentication"

	if dialog.Message("Open Browser to Get OPEN AI API KEY ").YesNo() {
		fmt.Println("\nGet OpenAi API Key from " + open_ai_url)
		load_url(open_ai_url)
	}

	print("Enter OpenAI API Key OR enter NONE to skip _ ")
	fmt.Scan(&open_ai_api_key)

	if dialog.Message("Open Browser to Get StabilityAI API KEY ").YesNo() {
		fmt.Println("\nGet StabilityAI API Key from " + stability_ai_url)
		load_url(stability_ai_url)
	}

	print("Enter StabilityAI API Key OR enter NONE to skip _ ")
	fmt.Scan(&stability_ai_api_key)

	// creates .env

	dot_env, dot_env_err := os.Create(".env")

	if dot_env_err != nil {
		println("Error: Fail to create .env file ", dot_env_err.Error())
	}

	dot_env.WriteString("OPENAI_API_KEY=" + open_ai_api_key + "\nDREAMSTUDIO_API_KEY=" + stability_ai_api_key)
	dot_env.Close()

	// Setup Guide
	pwd, _ := os.Getwd()
	println("\n=== Whatsapp AI Bot Ready To Run ===")
	println("\r - To run next time go to 'whatsapp-ai-bot-master' folder & run setup.exe")
	println("\r OR ")
	println("\r - copy & paste following code in command prompt\n   pushd D: && cd " + pwd + " && npx yarn dev\n\n")

	// Setup Guide to file

	how_to_run_file, _ := os.Create("run instruction.txt")

	how_to_run_file.WriteString(
		"-> Go to Search Box \n-> type cmd & press enter\n-> paste following in code in cmd\n\n" +
			"pushd " + strings.Split(pwd, ":")[0] + ": & cd " + pwd + " & npx yarn & npx yarn dev")
	how_to_run_file.Close()

	// clean up directories

	os.Remove("../node-setup.msi")
	os.Remove("../whatsapp-ai-bot.zip")

	// run bot

	run_cmd := exec.Command("powershell", "-command", "start", "./setup.exe")
	_, run_err := run_cmd.Output()
	if run_err != nil {
		println("Error: fail to open 'setup.exe' Go to whatsapp-ai-bot-master and open setup.exe to run the bot")
	}
}

// driver code
func main() {
	cmd := exec.Command("node", "--version")
	_, err := cmd.Output()

	if err != nil {
		fmt.Println("Node-Js not install in this machine. Going to install Node-Js \nPlease Wait it may take some time")
		install_nodejs()
	} else {
		fmt.Println("NodeJs Already Install")
	}

	// fetch repo
	rm_err := os.RemoveAll("./whatsapp-ai-bot-master")
	if rm_err != nil {
		println("Fail to remove previous Directories", string(rm_err.Error()))
	}

	fmt.Println("Downloading Github Repo ...")
	repo_url := "https://github.com/Zain-ul-din/whatsapp-ai-bot/archive/refs/heads/master.zip"
	download_res := downloadFile("whatsapp-ai-bot.zip", repo_url)
	if download_res != nil {
		println("Error: Fail to clone github repo from " + repo_url)
	}

	fmt.Println("Unzipping Source Code")
	unzip_cmd := exec.Command(
		"powershell",
		"-command",
		"Expand-Archive",
		"-Path",
		"./whatsapp-ai-bot.zip",
		"-DestinationPath",
		"./",
	)

	_, unzip_err := unzip_cmd.Output()
	if unzip_err != nil {
		println("Error: Fail to unzip file")
	}

	run_bot()
}

// func runCommandWithProgress(command string, args ...string) error {
// 	// Create a new command
// 	cmd := exec.Command(command, args...)

// 	// Redirect standard output and standard error to our program's streams
// 	cmd.Stdout = os.Stdout
// 	cmd.Stderr = os.Stderr

// 	// Start the command
// 	err := cmd.Start()
// 	if err != nil {
// 		return err
// 	}

// 	// Wait for the command to complete
// 	err = cmd.Wait()
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }
