# Cross Copy

**Cross Copy** is a simple, streamlined application designed for immediate sharing of text and media across various platforms. It offers a hassle-free solution to transfer text, photos, and files across different devices and operating systems without the need for email or cloud storage services like Google Drive or Dropbox.

## Features

- **Cross-Platform Sharing**: Copy and synchronize links, text, and images across multiple platforms, ensuring your data is always within reach.
- **Instant Photo Transfer**: Send photos from your phone directly to your laptop in a flash, eliminating the need for cumbersome self-emails.
- **Unified File Transfer**: Seamlessly send files up to 200MB between Windows, Mac, Linux, and mobile systems without email limits.
- **Integrated History**: Keep track of all your shared content with an integrated history feature, making it easy to revisit items as needed.
- **Secure Authentication and Storage**: Uses Firebase Authentication, Firestore, and Google Cloud Storage for secure data management and storage.

## Why I Built Cross Copy

At its core, **Cross Copy** was created to provide a simple way to avoid the hassle of emailing text and files to yourself. It functions similarly to Google Drive or Dropbox, but without the complexity of folders, subscriptions, or size limits.

As with many of my projects, **Cross Copy** was born out of a personal need. In my previous job, I frequently had to create and deliver reports that included photos from job sites. Using an iPhone with a Windows PC meant emailing photos to myself, which was cumbersome due to email size limits (especially when each photo is over 6MB). Additionally, transferring files between my personal Mac and work PC was often a pain.

While there are numerous solutions available—many of which offer more features than **Cross Copy**—I built this tool because I wanted to see if I could create a simpler, more streamlined solution that met my specific needs. **Cross Copy** eliminates the bloat of traditional cloud storage services, offering a basic interface that works well on both mobile and desktop. Files are automatically deleted after 7 days, and no account or subscription is required.

## The Main Web App

The main web application allows users to transfer text, photos, and files directly in the browser from any device. Anything added to the homepage is instantly synced to the user's account and is available in the browser, mobile app, and Chrome extension on any device.

There is no compression or restriction on what kind of file can be transferred, which is ideal for sending full-resolution images. The current limit is 200MB per file.

## The Mobile Application

The mobile application, built using React Native and Expo, enables users to share photos and files directly from their mobile devices to **Cross Copy**, bypassing the need to first open a mobile browser.

The mobile app leverages native libraries to enhance functionality. For example:

- **`react-native-receive-sharing-intent`**: This library creates a sharing target so users can share photos and files directly to the app.
- **`react-native-document-scanner-plugin`**: This plugin allows users to quickly generate PDF documents from their camera. It's particularly useful for scanning documents such as licenses and passports.

Whenever I need to scan a document, I almost always use **Cross Copy** due to its convenience and speed.

## The Chrome Extension

The Chrome extension for **Cross Copy** offers quick access to copied text, files, and photos. Simply click on the **Cross Copy** extension icon when using Chrome to instantly retrieve and manage your content.

## Technologies Used

- **Frontend**: React.js, React Native (Expo)
- **Backend**: Firebase Authentication, Firestore, Google Cloud Storage
- **Mobile**: React Native, Expo, Native Modules
- **Browser Extension**: Chrome Extension API, React

### Contributing

Contributions are welcome! Please fork the repository and use a feature branch. Pull requests are welcome.

### License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License. 

You are free to share and adapt the material, but you must give appropriate credit and you may not use the material for commercial purposes.

[View the full license](https://creativecommons.org/licenses/by-nc/4.0/).



