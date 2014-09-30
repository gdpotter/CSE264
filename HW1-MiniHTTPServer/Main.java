/* CSE 264 - Fall 2014
 * Homework #1 - Mini HTTP Server
 * Name: Greg Potter
 * Date: 8/27/2014
 */
package edu.lehigh.cse264;

import java.io.*;
import java.net.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class Main {
    // The port can be any small integer that isn't being used by another program
    private static final int port = 8567;

    public static void main(String[] args) {
        try {
            System.out.println("Mini HTTP Server Starting Up");
            // Listen on port for a new connection request
            ServerSocket s = new ServerSocket(port);
            for (;;) {
               
                // Wait for a new TCP connection to come in from a client and 
                // accept it when it does. Return a reference to the socket 
                // that will be used to communicate with the client.
                Socket newSocket = s.accept();
                System.out.println("New connection from: " + ((InetSocketAddress)newSocket.getRemoteSocketAddress()).getAddress().getHostAddress());
                
                // Create a new handler object to handle the requests of the 
                // client that just connected.
                ClientHandler handler = new ClientHandler(newSocket);
                
                // Give the handler its own thread to handle requests to that 
                // the server can handle multiple clients simultaneously.
                new Thread(handler).start();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class ClientHandler implements Runnable {
    // Socket used to handle the client requests.
    private Socket socket;
    
    // SimpleDateFormat for formatting the last-modified header
    private final SimpleDateFormat LAST_MODIFIED_FORMAT = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz");
    
    private final String LOG_FILE = "server.log";
    
    private FileOutputStream logStream;

    public ClientHandler(Socket s) {
        this.socket = s;
        try {
            logStream = new FileOutputStream(new File(LOG_FILE), true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void run() {
        try {
            BufferedReader request = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            DataOutputStream response = new DataOutputStream(socket.getOutputStream());
            List<String> headers = new ArrayList<>();

            try {
                String firstLine = request.readLine();
                if (firstLine.length() > 0) {
                    // Read Headers, one per line of the request
                    String line;
                    while ((line = request.readLine()).length() > 0) {
                        headers.add(line);
                    }
                    // Break the request line up unto individual token
                    String[] tokens = firstLine.split(" ");
                    
                    // The first token is the method name (GET, POST, etc.)
                    String method = tokens[0];
                    
                    // The second token is the resource being requested (eg. /index.html)
                    String resource = tokens[1];
                    
                    // Dump the entire request to the console for debugging
                    dumpRequest(firstLine, headers);
                    
                    // Process the request based on the method used (GET is the only
                    // one we're implementing for now
                    int responseCode = 0;
                    switch (method) {
                        case "GET":
                            responseCode = processGET(resource, headers, response);
                            break;
                        case "POST":
                            System.err.println(method + " method not implemented.");
                            break;
                        case "HEAD":
                            System.err.println(method + " method not implemented.");
                            break;
                        case "PUT":
                            System.err.println(method + " method not implemented.");
                            break;
                        case "DELETE":
                            System.err.println(method + " method not implemented.");
                            break;
                        case "TRACE":
                            System.err.println(method + " method not implemented.");
                            break;
                        case "OPTIONS":
                            System.err.println(method + " method not implemented.");
                            break;
                        default:
                            System.err.println("Unknown method: " + method);
                            break;
                    }              
                    // Log the request to a file
                    logRequest(socket.getInetAddress().getHostAddress(), responseCode, firstLine);
                }
            } catch (Exception e) {
               // If we get an i/o error, tell the user that the resource is unavailable
               response.writeBytes("HTTP/1.1 404 ERROR\n\n");
            }
            // Clean up once the request has been processed
            request.close();
            response.close();
        } catch (Exception ex1) {
            System.out.println("Internal error: " + ex1.getMessage());
        }
    }

    // Write out the request header lines to the console
    private void dumpRequest(String firstLine, List<String> headers) {
        System.out.println(firstLine);
        for (String headerLine : headers) {
            System.out.println(headerLine);
        }
        System.out.println();
    }
    
    // For a given client address, responsecode, and first line, log the
    // request to the log file
    private void logRequest(String ipAddress, int responseCode, String firstLine) {
        if (logStream != null) {
            try {
               logStream.write(String.format("%s - \"%s\" %d\n", ipAddress, firstLine, responseCode).getBytes());
               logStream.flush();
               logStream.close();
            } catch (IOException e) {
               e.printStackTrace();
            }   
        }
    }

    private int processGET(String resource, List<String> headers, DataOutputStream out) {
        try {

            // Default to index.html
            if (resource.endsWith("/")) {
                resource += "index.html";
            }

            // Create file path from requested resource compatable with the host OS
            String path = ("." + resource).replace('/', File.separatorChar);
            File file = new File(path);
            int length = (int) file.length();
            byte[] b = new byte[length];
            
            String lastModified = LAST_MODIFIED_FORMAT.format(file.lastModified());

            // Read the requested resource into an array of bytes
            FileInputStream resourceStream;
            try {
                resourceStream = new FileInputStream(path);
                resourceStream.read(b);
            } catch (IOException ex) {
                out.writeBytes("HTTP/1.1 404 ERROR\n\n");
                return 404;
            }
            
            // Determine the content-type
            String contentType = determineContentType(resource);

            // Write HTTP response line to client
            out.writeBytes("HTTP/1.1 200 OK\n");
            
            // Write out the headers
            out.writeBytes("Content-Length:" + length + "\n");
            out.writeBytes("Content-Type:" + contentType + "\n");
            out.writeBytes("Last-Modified:" + lastModified + "\n");
            out.writeBytes("Connection: close\n");
            
            // Blank line ends the header section
            out.writeBytes("\n"); 
            
            // Send the requested resource to the client
            out.write(b, 0, length);
            
            // Return code 200 means "Successful"
            return 200;
        } catch (IOException ex) {
            try {
                out.writeBytes("HTTP/1.1 500 ERROR\n\n");
                return 500;
            } catch (IOException ex1) {
                System.out.println("Internal error: " + ex1.getMessage());
                return 500;
            }
        }
    }
    
    private String determineContentType(final String resource) {
        int lastPeriodIndex = resource.lastIndexOf(".");
        if (lastPeriodIndex > 0) {
            String extension = resource.substring(lastPeriodIndex + 1);
            switch (extension) {
                case "gif":
                    return "image/gif";
                case "jpg":
                case "jpeg":
                    return "image/jpeg";
                case "png":
                    return "image/png";
                case "pdf":
                    return "application/pdf";
                case "xls":
                case "xlsx":
                    return "application/vnd.ms-excel";
                case "htm":
                case "html":
                    return "text/html";
            }
        }
        return "text/plain"; // default to text/plain
    }
}