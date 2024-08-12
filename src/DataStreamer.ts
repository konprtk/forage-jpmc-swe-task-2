export interface Order {
  price: number;
  size: number;
}

/**
 * The datafeed server returns an array of ServerRespond with 2 stocks.
 * We do not have to manipulate the ServerRespond for the purpose of this task.
 */
export interface ServerRespond {
  stock: string;
  top_bid: Order;
  top_ask: Order;
  timestamp: Date;
}

class DataStreamer {
  // The url where datafeed server is listening
  static API_URL: string = 'http://localhost:8080/query?id=1';

  /**
   * Send request to the datafeed server and executes callback function on success
   * @param callback callback function that takes JSON object as its argument
   */
  static getData(callback: (data: ServerRespond[]) => void): void {
    const request = new XMLHttpRequest();
    request.open('GET', DataStreamer.API_URL, true); // Set to asynchronous

    request.onload = () => {
      if (request.status === 200) {
        try {
          const data: ServerRespond[] = JSON.parse(request.responseText);
          callback(data);
        } catch (error) {
          console.error('Failed to parse response JSON:', error);
        }
      } else {
        console.error('Request failed with status:', request.status);
      }
    };

    request.onerror = () => {
      console.error('Request failed due to a network error.');
    };

    request.send();
  }
}

export default DataStreamer;
