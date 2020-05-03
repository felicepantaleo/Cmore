

package org.tensorflow.lite.examples.detection.customview;

import java.util.List;
import org.tensorflow.lite.examples.detection.tflite.Classifier.Recognition;

public interface ResultsView {
  public void setResults(final List<Recognition> results);
}
