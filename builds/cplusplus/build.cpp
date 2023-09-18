#include <iostream>
#include <cstdlib>
#include <filesystem>
#include "FileDownloader.hpp"

class BuildMaker {
public:
    void make_build();
};

class Build {
public:
    virtual void build() = 0;
    virtual void check_dependencies() =0;
};

// driver code
int main () {
	(new BuildMaker())
    ->make_build();
    std::cin.get();
    std::cout << "\nProgram Exit With Status 0 \n";
    return EXIT_SUCCESS; 
}

class WindowBuild : public Build {
public:
    void build() override;
    void check_dependencies() override;
};

// class LinuxBuild: public Build {
//     public:
//         void build() override;
//         void check_dependencies() override;
// };

// class MacBuild: public Build {
//     public:
//         void build() override;
//         void check_dependencies() override;
// };

// class UnixBuild: public Build {
//     public:
//         void build() override;
//         void check_dependencies() override;
// };

void BuildMaker::make_build() {
    Build* build;

    #if defined(_WIN32) || defined(__CYGWIN__)
    
    build = new WindowBuild();
    
    #elif defined(__linux__)
    
    // build = new LinuxBuild();

    #elif defined(__APPLE__) && defined(__MACH__)
    
    // build = new MacBuild();

    #elif defined(unix) || defined(__unix__) || defined(__unix)
    
    // build = new UnixBuild();

    #else

    #error Unknown environment!
    
    #endif

    build->check_dependencies();
    build->build();
}

void WindowBuild::check_dependencies () {
    // checks if node js already install
    // bool node_installed = system("node --version") == 0;
    bool node_installed = false;
    if(!node_installed) {
        std::cout << "Node Js Not Installed Going to Install Node Js\n" 
            << "\nPlease Wait, It may take some time to download... \n";
        FileDownloader::instance()->download(
            "https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi",
            "node.msi"
        );
        std::cout << "Node Js Installed Successfully \n";
        std::cout 
            << "Node Js Installation Guide \n"
            << "- Click Next \n"
            << "- Accept License \n"
            << "- Click Next and keep selecting next ...\n";
        system("node.msi");
        if(system("npm --version") == 1) {
            std::cout << "Node Js Installation fail \n";
            std::exit(1);
        }
    }
}

void WindowBuild::build() {
    std::cout << "Downloading Source file from Github.\n";
    
    const char* repo_url = "https://github.com/Zain-ul-din/whatsapp-ai-bot/archive/refs/heads/master.zip";
    const char* zip_destination = "whatsapp-ai-bot/source-code.zip";
    const char* dist_dir = "./whatsapp-ai-bot";

    std::filesystem::directory_entry install_dir {dist_dir};
    std::filesystem::remove_all(dist_dir);
    std::filesystem::create_directory(dist_dir);
    
    FileDownloader::instance()->download(
        repo_url,
        zip_destination
    );
    
    std::cout 
    << "\n Source Code has been Downloaded \n"
    << "Please Wait, Preparing Files \n";

    const std::string power_shell_unzip_command = 
        "powershell -command Expand-Archive -Path " + std::string(zip_destination) +
        " -DestinationPath " + std::string(dist_dir)
    ;
    
    std::cout << "Un-zipping source files " << power_shell_unzip_command << "\n";

    system(power_shell_unzip_command.c_str());
    // std::filesystem::remove(zip_destination);
    system(std::string("cd " + std::string(dist_dir) + " && "
        " cd whatsapp-ai-bot-master && npx yarn && npx yarn dev").c_str());
}

