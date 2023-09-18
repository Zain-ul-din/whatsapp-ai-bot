#ifndef FILE_DOWNLOADER_HPP
#define FILE_DOWNLOADER_HPP

#include <iostream>
#include <fstream>
#include <string>
#include <sstream>
#include <curl/curl.h>

class FileDownloader {
    CURL* curl;
    
    FileDownloader ()
    {
        curl = curl_easy_init();
        if(!curl) {
            std::cout << "error: fail to init curl_easy_init \n";
        }
    }

    static size_t WriteCallback(void *contents, size_t size, size_t nmemb, void *userp)
    {
        ((std::string*)userp)->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

    static FileDownloader* _instance;
public:

    static FileDownloader* instance ()
    {
        if(FileDownloader::_instance == nullptr)
            _instance = new FileDownloader();
        return _instance;
    }
    
    std::string download(const std::string& url)
    {
        CURLcode res;
        std::string readBuffer;

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L); // follow redirects
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, &WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);

        return readBuffer;
    }

    void download(const char* content_url, const char* save_path) {
        FILE* fp = fopen(save_path,"wb");
        curl_easy_setopt(curl, CURLOPT_URL, content_url);
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L); // follow redirects
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, NULL);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, fp);
        CURLcode res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        fclose(fp);
    }
};

FileDownloader* FileDownloader::_instance = nullptr;

#endif // FILE_DOWNLOADER_HPP